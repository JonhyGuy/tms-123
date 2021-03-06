import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { Status } from '@bits404/api-interfaces';
import { select, Store } from '@ngrx/store';
import { DeleteManyBoxes, DeleteOneBox, RequestBoxesPage, ViewBox } from '@tms/actions/box.actions';
import { LayoutUtilsService, MessageType, QueryParamsModel } from '@tms/crud';
import { BoxesDataSource } from '@tms/data-sources';
import { SubheaderService } from '@tms/layout';
import { BoxModel } from '@tms/models';
import { AppState } from '@tms/reducers';
import { selectBoxesPageLastQuery } from '@tms/selectors/boxes.selectors';
import { CustomTranslateService, TranslateParams } from '@tms/translate';
import { fromEvent, merge, of, Subject } from 'rxjs';
import { debounceTime, delay, distinctUntilChanged, skip, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'b404-boxes-list',
  templateUrl: './boxes-list.component.html',
  styleUrls: ['./boxes-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoxesListComponent implements OnInit, OnDestroy {
  // Table fields
  dataSource: BoxesDataSource;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('sort1', { static: true }) sort: MatSort;
  // Filter fields
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  filterStatus = '';
  filterCondition = '';
  lastQuery: QueryParamsModel;
  // Selection
  selection = new SelectionModel<BoxModel>(true, []);
  boxesResult: BoxModel[] = [];

  public get displayedColumns() {
    const cols = ['Model', 'Type', 'Km', 'SerialNumber', 'Brand', 'Status', 'Actions',];
    if (this.isDesktop) {
      cols.unshift('Select');
    }
    return cols;
  };

  public get isDesktop() {
    return this.windowWidth > 1024;
  }

  public windowWidth = 0;

  protected STATUS = Status;
  public translateParams: TranslateParams;

  private ngUnsubscribe = new Subject();
  constructor(
    private router: Router,
    public dialog: MatDialog,
    private store: Store<AppState>,
    private activatedRoute: ActivatedRoute,
    private translate: CustomTranslateService,
    private subheaderService: SubheaderService,
    private layoutUtilsService: LayoutUtilsService,
  ) {
    this.translateParams = {
      entity: this.translate.instant('WORKSHOP.BOXES.ENTITY'),
      entities: this.translate.instant('WORKSHOP.BOXES.ENTITIES'),
    };
  }

  ngOnInit() {
    this.windowWidth = window.innerWidth;
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadBoxesList()),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();

    // Filtration, bind to searchInput
    fromEvent(this.searchInput.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadBoxesList();
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();

    // Set title to page breadCrumbs
    this.subheaderService.setTitle(
      this.translate.instant('WORKSHOP.BOXES.ENTITIES.VALUE')
    );

    // Init DataSource
    this.dataSource = new BoxesDataSource(this.store);
    this.dataSource.entitySubject
      .pipe(skip(1), distinctUntilChanged(), takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
        this.boxesResult = res;
      });
    this.store
      .pipe(select(selectBoxesPageLastQuery))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res) => (this.lastQuery = res));
    // Load last query from store

    // Read from URL itemId, for restore previous state
    const routeSubscription = this.activatedRoute.queryParams
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((params) => {
        // First load
        of(undefined)
          .pipe(delay(1000), takeUntil(this.ngUnsubscribe))
          .subscribe(() => {
            // Remove this line, just loading imitation
            this.loadBoxesList();
          }); // Remove this line, just loading imitation
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  loadBoxesList() {
    this.selection.clear();
    const queryParams = new QueryParamsModel(
      this.filterConfiguration(),
      this.sort.direction,
      this.sort.active,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );
    // Call request from server
    this.store.dispatch(new RequestBoxesPage({ page: queryParams }));
    this.selection.clear();
  }

  filterConfiguration(): any {
    const filter: any = {};
    const searchText: string = this.searchInput.nativeElement.value;

    if (this.filterCondition && this.filterCondition.length > 0) {
      filter.condition = +this.filterCondition;
    }
    filter.id = searchText;
    filter.model = searchText;
    filter.type = searchText;
    filter.km = searchText;
    filter.serialNumber = searchText;
    filter.brand = searchText;

    return filter;
  }

  deleteBox(_item: BoxModel) {
    const title = this.translate.instant('MODULE.DELETE_ONE_TITLE', this.translateParams);
    const description = this.translate.instant('MODULE.DELETE_ONE_DESCRIPTION', this.translateParams);
    const deleteMessage = this.translate.instant('MODULE.DELETE_ONE_MESSAGE', this.translateParams);

    const dialogRef = this.layoutUtilsService.deleteElement({ title, description });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
        if (!res) {
          return;
        }

        this.store.dispatch(new DeleteOneBox({ id: _item.id }));
        this.layoutUtilsService.showActionNotification(
          deleteMessage,
          MessageType.Delete
        );
      });
  }

  deleteBoxes() {
    const title = this.translate.instant('MODULE.DELETE_MANY_TITLE', this.translateParams);
    const description = this.translate.instant('MODULE.DELETE_MANY_DESCRIPTION', this.translateParams);
    const deleteMessage = this.translate.instant('MODULE.DELETE_MANY_MESSAGE', this.translateParams);

    const dialogRef = this.layoutUtilsService.deleteElement({ title, description });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
        if (!res) {
          return;
        }

        const idsForDeletion: string[] = [];
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.selection.selected.length; i++) {
          idsForDeletion.push(this.selection.selected[i].id);
        }
        this.store.dispatch(new DeleteManyBoxes({ ids: idsForDeletion }));
        this.layoutUtilsService.showActionNotification(
          deleteMessage,
          MessageType.Delete
        );
        this.selection.clear();
      });
  }

  editBox(id) {
    this.router.navigate(['../boxes/edit', id], {
      relativeTo: this.activatedRoute,
    });
  }

  createBox() {
    this.router.navigateByUrl('/workshop/boxes/add');
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.boxesResult.length;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.boxesResult.forEach((row) => this.selection.select(row));
    }
  }

  viewBox(id: string) {
    this.store.dispatch(new ViewBox({ id }));
  }
}

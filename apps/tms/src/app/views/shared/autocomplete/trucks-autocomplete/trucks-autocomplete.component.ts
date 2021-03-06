import { FocusMonitor } from '@angular/cdk/a11y';
import { Component, ElementRef, EventEmitter, HostBinding, Input, OnDestroy, OnInit, Optional, Output, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Store } from '@ngrx/store';
import { TruckModel } from '@tms/models';
import { AppState } from '@tms/reducers';
import { TrucksService } from '@tms/services';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, share, switchMap, takeUntil, tap } from 'rxjs/operators';
import { BaseAutocompleteComponent } from '../base-autocomplete/base-autocomplete.component';

@Component({
  selector: 'b404-trucks-autocomplete',
  templateUrl: './trucks-autocomplete.component.html',
  styleUrls: ['../base-autocomplete/base-autocomplete.component.scss'],
  providers: [{
    provide: MatFormFieldControl,
    useExisting: TrucksAutocompleteComponent
  }]
})
export class TrucksAutocompleteComponent extends BaseAutocompleteComponent
  implements MatFormFieldControl<TruckModel>, ControlValueAccessor, OnInit, OnDestroy {

  @Input() selectedModels: TruckModel[] = [];
  @Output() selectedModelsChange = new EventEmitter<TruckModel[]>();

  protected modelKey = 'id';
  protected modelSearchKey = 'serialNumber';

  protected get newModel(): TruckModel {
    return new TruckModel();
  }

  public models$: Observable<TruckModel[]>;

  @Input() public get value(): TruckModel | null { return this.formControl.value; }
  public set value(model: TruckModel | null) {
    if (!this.formControl) {
      return;
    }
    this.onChange(model);
    this.stateChanges.next();
  }

  @HostBinding() public id = `trucks-autocomplete-${TrucksAutocompleteComponent.nextId++}`;
  constructor(
    @Optional() @Self() public ngControl: NgControl,
    protected fm: FocusMonitor,
    protected store: Store<AppState>,
    protected elRef: ElementRef<HTMLElement>,
    private trucksService: TrucksService,
  ) {
    super(ngControl, fm, store, elRef);
  }

  ngOnInit() {
    setTimeout(() => {
      this.initFormControl();
    });
  }

  protected listenChanges() {
    this.models$ = this.formControl.valueChanges
      .pipe(
        debounceTime(300),
        filter(value => !!value),
        distinctUntilChanged((a: TruckModel, b: TruckModel) => a.nickname === b.nickname),
        tap(value => {
          this.modelText = value.nickname;
          this.modelTextChange.next(value.nickname);
        }),
        filter(value => this.lastSearchHadResults(value)),
        filter(() => this.changedModel ? this.changedModel = false : true),
        switchMap(value => {
          this.loading.next(true);
          const search = value.nickname || '';
          return this.trucksService.findQueryTrucks(search).pipe(
            map(response => response.items),
            tap(response => {
              this.haveModels = response.length > 0;
              this.lastSearch = {
                text: search,
                resultsFound: this.haveModels
              };
              this.loading.next(false);
            })
          );
        }),
        share(),
        takeUntil(this.ngUnsubscribe),
      );
  }

  protected shouldReloadPanel() {
    if (
      this.haveModels ||
      this.loading.value ||
      this.value && (this.value.nickname !== '' || !!this.value.id)
    ) {
      return false;
    }
    return true;
  }

  public displayFn(model: TruckModel): string {
    return model && model.nickname !== undefined ? model.nickname : '';
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

}

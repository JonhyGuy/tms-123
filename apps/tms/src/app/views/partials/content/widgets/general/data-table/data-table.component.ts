import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { QueryParamsModel } from '@tms/crud';
import { DataTableItemModel, DataTableService } from '@tms/layout';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DataTableDataSource } from './data-table.data-source';

@Component({
  selector: 'b404-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit {
  // Public properties
  dataSource: DataTableDataSource;
  displayedColumns = ['id', 'cManufacture', 'cModel', 'cMileage', 'cColor', 'cPrice', 'cCondition', 'cStatus', 'actions'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  selection = new SelectionModel<DataTableItemModel>(true, []);

  /**
   * Component constructor
   *
   * @param dataTableService: DataTableService
   */
  constructor(private dataTableService: DataTableService) { }

  /**
   * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
   */

  /**
   * On init
   */
  ngOnInit() {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    /* Data load will be triggered in two cases:
    - when a pagination event occurs => this.paginator.page
    - when a sort event occurs => this.sort.sortChange
    **/
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => {
          this.loadItems();
        })
      )
      .subscribe();

    // Init DataSource
    this.dataSource = new DataTableDataSource(this.dataTableService);
    // First load
    this.loadItems(true);
  }

  /**
   * Load items
   *
   * @param firstLoad: boolean
   */
  loadItems(firstLoad: boolean = false) {
    const queryParams = new QueryParamsModel(
      {},
      this.sort.direction,
      this.sort.active,
      this.paginator.pageIndex,
      firstLoad ? 6 : this.paginator.pageSize
    );
    this.dataSource.loadItems(queryParams);
    this.selection.clear();
  }

  /* UI */

  /**
   * Returns item status
   *
   * @param status: number
   */
  getItemStatusString(status: number = 0): string {
    switch (status) {
      case 0:
        return 'Selling';
      case 1:
        return 'Sold';
    }
    return '';
  }

  /**
   * Returens item CSS Class Name by status
   *
   * @param status: number
   */
  getItemCssClassByStatus(status: number = 0): string {
    switch (status) {
      case 0:
        return 'success';
      case 1:
        return 'info';
    }
    return '';
  }

  /**
   * Returns item condition
   *
   * @param condition: number
   */
  getItemConditionString(condition: number = 0): string {
    switch (condition) {
      case 0:
        return 'New';
      case 1:
        return 'Used';
    }
    return '';
  }

  /**
   * Returns CSS Class name by condition
   *
   * @param condition: number
   */
  getItemCssClassByCondition(condition: number = 0): string {
    switch (condition) {
      case 0:
        return 'success';
      case 1:
        return 'info';
    }
    return '';
  }
}

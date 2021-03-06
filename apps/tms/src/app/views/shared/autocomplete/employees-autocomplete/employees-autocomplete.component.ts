import { FocusMonitor } from '@angular/cdk/a11y';
import { Component, ElementRef, EventEmitter, HostBinding, Input, OnDestroy, OnInit, Optional, Output, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Store } from '@ngrx/store';
import { EmployeeModel } from '@tms/models';
import { AppState } from '@tms/reducers';
import { EmployeesService } from '@tms/services';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, share, switchMap, takeUntil, tap } from 'rxjs/operators';
import { BaseAutocompleteComponent } from '../base-autocomplete/base-autocomplete.component';

@Component({
  selector: 'b404-employees-autocomplete',
  templateUrl: './employees-autocomplete.component.html',
  styleUrls: ['../base-autocomplete/base-autocomplete.component.scss'],
  providers: [{
    provide: MatFormFieldControl,
    useExisting: EmployeesAutocompleteComponent
  }]
})
export class EmployeesAutocompleteComponent extends BaseAutocompleteComponent
  implements MatFormFieldControl<EmployeeModel>, ControlValueAccessor, OnInit, OnDestroy {

  @Input() selectedModels: EmployeeModel[] = [];
  @Output() selectedModelsChange = new EventEmitter<EmployeeModel[]>();

  protected modelKey = 'id';
  protected modelSearchKey = 'firstName';

  protected get newModel(): EmployeeModel {
    return new EmployeeModel();
  }

  public models$: Observable<EmployeeModel[]>;

  @Input() public get value(): EmployeeModel | null { return this.formControl.value; }
  public set value(model: EmployeeModel | null) {
    if (!this.formControl) {
      return;
    }
    this.onChange(model);
    this.stateChanges.next();
  }

  @HostBinding() public id = `employees-autocomplete-${EmployeesAutocompleteComponent.nextId++}`;
  constructor(
    @Optional() @Self() public ngControl: NgControl,
    protected fm: FocusMonitor,
    protected store: Store<AppState>,
    protected elRef: ElementRef<HTMLElement>,
    private employeesService: EmployeesService,
  ) {
    super(ngControl, fm, store, elRef);
  }

  ngOnInit() {
    setTimeout(() => {
      this.initFormControl();
    });
    console.log(this.models$);
  }

  protected listenChanges() {
    this.models$ = this.formControl.valueChanges
      .pipe(
        debounceTime(300),
        filter(value => !!value),
        distinctUntilChanged((a: EmployeeModel, b: EmployeeModel) => a.firstName === b.firstName),
        tap(value => {
          this.modelText = value.firstName;
          this.modelTextChange.next(value.firstName);
        }),
        filter(value => this.lastSearchHadResults(value)),
        filter(() => this.changedModel ? this.changedModel = false : true),
        switchMap(value => {
          this.loading.next(true);
          const search = value.firstName;
          return this.employeesService.findQueryEmployees(search).pipe(
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
    console.log(this.models$);
  }

  protected shouldReloadPanel() {
    console.log(this.haveModels, this.loading.value, this.value && (this.value.firstName !== '' || !!this.value.id));
    if (
      this.haveModels ||
      this.loading.value ||
      this.value && (this.value.firstName !== '' || !!this.value.id)
    ) {
      return false;
    }
    return true;
  }

  public displayFn(model: EmployeeModel): string {
    return model && model.firstName !== undefined ? model.firstName : '';
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

}

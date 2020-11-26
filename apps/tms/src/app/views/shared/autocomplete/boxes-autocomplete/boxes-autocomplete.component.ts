import { FocusMonitor } from '@angular/cdk/a11y';
import { Component, ElementRef, EventEmitter, HostBinding, Input, OnDestroy, OnInit, Optional, Output, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Store } from '@ngrx/store';
import { BoxModel } from '@tms/models';
import { AppState } from '@tms/reducers';
import { BoxesService } from '@tms/services';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, share, switchMap, takeUntil, tap } from 'rxjs/operators';
import { BaseAutocompleteComponent } from '../base-autocomplete/base-autocomplete.component';

@Component({
  selector: 'b404-boxes-autocomplete',
  templateUrl: './boxes-autocomplete.component.html',
  styleUrls: ['../base-autocomplete/base-autocomplete.component.scss'],
  providers: [{
    provide: MatFormFieldControl,
    useExisting: BoxesAutocompleteComponent
  }]
})
export class BoxesAutocompleteComponent extends BaseAutocompleteComponent
  implements MatFormFieldControl<BoxModel>, ControlValueAccessor, OnInit, OnDestroy {

  @Input() selectedModels: BoxModel[] = [];
  @Output() selectedModelsChange = new EventEmitter<BoxModel[]>();

  protected modelKey = 'id';
  protected modelSearchKey = 'Name';

  protected get newModel(): BoxModel {
    return new BoxModel();
  }

  public models$: Observable<BoxModel[]>;

  @Input() public get value(): BoxModel | null { return this.formControl.value; }
  public set value(model: BoxModel | null) {
    if (!this.formControl) {
      return;
    }
    this.onChange(model);
    this.stateChanges.next();
  }

  @HostBinding() public id = `clients-autocomplete-${BoxesAutocompleteComponent.nextId++}`;
  constructor(
    @Optional() @Self() public ngControl: NgControl,
    protected fm: FocusMonitor,
    protected store: Store<AppState>,
    protected elRef: ElementRef<HTMLElement>,
    private tiresService: BoxesService,
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
        distinctUntilChanged((a: BoxModel, b: BoxModel) => a.serialNumber === b.serialNumber),
        tap(value => {
          this.modelText = value.serialNumber;
          this.modelTextChange.next(value.serialNumber);
        }),
        filter(value => this.lastSearchHadResults(value)),
        filter(() => this.changedModel ? this.changedModel = false : true),
        switchMap(value => {
          this.loading.next(true);
          const search = value.serialNumber;
          return this.tiresService.findQueryBoxes(search).pipe(
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
    console.log(this.haveModels, this.loading.value, this.value && (this.value.serialNumber !== '' || !!this.value.id));
    if (
      this.haveModels ||
      this.loading.value ||
      this.value && (this.value.serialNumber !== '' || !!this.value.id)
    ) {
      return false;
    }
    return true;
  }

  public displayFn(model: BoxModel): string {
    return model && model.serialNumber !== undefined ? model.serialNumber : '';
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

}

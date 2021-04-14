import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { HttpUtilsService, LayoutUtilsService, TypesUtilsService } from '@tms/crud';
import { TravelEffects } from '@tms/effects';
import { environment } from '@tms/environments/environment';
import { CurrentTravelStatusPipe, FakeApiService, NextTravelStatusPipe } from '@tms/layout';
import { travelsReducer } from '@tms/reducers';
import { CompletedTravelService, TravelsService } from '@tms/services';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { NgxPermissionsModule } from 'ngx-permissions';
import { ActionNotificationComponent, DeleteEntityDialogComponent, FetchEntityDialogComponent, UpdateStatusDialogComponent } from '../../../partials/content/crud';
import { PartialsModule } from '../../../partials/partials.module';
import { SharedModule } from '../../../shared/shared.module';
import { CompletedTravelsListModule } from '../completed-travels/completed-travels-list/completed-travels-list.module';
import { ChangeStatusDialogComponent } from '../components/change-status-dialog/change-status-dialog.component';
import { ChangeStatusDialogModule } from '../components/change-status-dialog/change-status-dialog.module';
import { TravelsListComponent } from './travels-list.component';

@NgModule({
  imports: [
    MatDialogModule,
    CommonModule,
    PartialsModule,
    NgxPermissionsModule.forChild(),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatMenuModule,
    MatSelectModule,
    CompletedTravelsListModule,
    MatInputModule,
    MatTableModule,
    MatAutocompleteModule,
    MatRadioModule,
    MatIconModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatCardModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTabsModule,
    MatTooltipModule,
    NgbProgressbarModule,
    RouterModule.forChild([
      {
        path: '',
        component: TravelsListComponent,
        children: [
          {
            path: 'operator',
            loadChildren: () => import('../../paysheet/employees/employees-view/employees-view.module').then(m => m.EmployeesViewModule),
          },
          {
            path: 'truck',
            loadChildren: () => import('../../paysheet/employees/employees-view/employees-view.module').then(m => m.EmployeesViewModule),
          },
          {
            path: 'box',
            loadChildren: () => import('../../paysheet/employees/employees-view/employees-view.module').then(m => m.EmployeesViewModule),
          },
        ]
      },
    ]),
    environment.isMockEnabled
      ? HttpClientInMemoryWebApiModule.forFeature(FakeApiService, {
        passThruUnknownUrl: true,
        dataEncapsulation: false,
      })
      : [],
    StoreModule.forFeature('travels', travelsReducer),
    EffectsModule.forFeature([TravelEffects]),
    SharedModule,
  ],
  providers: [
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        hasBackdrop: true,
        panelClass: 'b404-mat-dialog-container__wrapper',
        height: 'auto',
        width: '900px',
      },
    },
    TypesUtilsService,
    LayoutUtilsService,
    HttpUtilsService,
    TravelsService,
    TypesUtilsService,
    LayoutUtilsService,
    CompletedTravelService,
    ChangeStatusDialogModule,
  ],
  entryComponents: [
    ActionNotificationComponent,
    DeleteEntityDialogComponent,
    FetchEntityDialogComponent,
    UpdateStatusDialogComponent,
    ChangeStatusDialogComponent
  ],
  declarations: [TravelsListComponent, CurrentTravelStatusPipe, NextTravelStatusPipe],
})
export class TravelListModule { }

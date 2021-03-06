import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as fromMaintenanceActions from '@tms/actions/maintenance.actions';
import { AppState } from '@tms/reducers';
import { MaintenancesService } from '@tms/services';
import { forkJoin, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { MaintenancesViewService } from '../../views/pages/workshop/maintenance/maintenances-view/maintenances-view.service';

@Injectable()
export class MaintenanceEffects {
  showPageLoadingDistpatcher = new fromMaintenanceActions.MaintenancesPageToggleLoading({ isLoading: true });
  showLoadingDistpatcher = new fromMaintenanceActions.MaintenancesPageToggleLoading({ isLoading: true });
  hideActionLoadingDistpatcher = new fromMaintenanceActions.MaintenancesPageToggleLoading({ isLoading: false });

  @Effect()
  loadMaintenancesPage$ = this.actions$
    .pipe(
      ofType<fromMaintenanceActions.RequestMaintenancesPage>(fromMaintenanceActions.MaintenanceActionTypes.RequestMaintenancesPage),
      mergeMap(({ payload }) => {
        this.store.dispatch(this.showPageLoadingDistpatcher);
        const queryResponse = this.maintenancesService.findMaintenances(payload.page);
        const lastQuery = of(payload.page);
        return forkJoin({ queryResponse, lastQuery }).pipe(
          catchError(error => {
            return of({
              queryResponse: {
                items: [],
                totalCount: 0,
              },
              lastQuery: payload.page,
            });
          })
        );
      }),
      map(({ queryResponse, lastQuery }) => {
        return new fromMaintenanceActions.LoadMaintenancesPage({
          maintenances: queryResponse.items,
          totalCount: queryResponse.totalCount,
          page: lastQuery,
        });
      })
    );

  @Effect()
  deleteMaintenance$ = this.actions$
    .pipe(
      ofType<fromMaintenanceActions.DeleteOneMaintenance>(fromMaintenanceActions.MaintenanceActionTypes.DeleteOneMaintenance),
      mergeMap(({ payload }) => {
        this.store.dispatch(this.showLoadingDistpatcher);
        return this.maintenancesService.deleteMaintenance(payload.id);
      }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteMaintenances$ = this.actions$
    .pipe(
      ofType<fromMaintenanceActions.DeleteManyMaintenances>(fromMaintenanceActions.MaintenanceActionTypes.DeleteManyMaintenances),
      mergeMap(({ payload }) => {
        this.store.dispatch(this.showLoadingDistpatcher);
        return this.maintenancesService.deleteMaintenances(payload.ids);
      }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateMaintenance$ = this.actions$
    .pipe(
      ofType<fromMaintenanceActions.UpdateMaintenance>(fromMaintenanceActions.MaintenanceActionTypes.UpdateMaintenance),
      mergeMap(({ payload }) => {
        this.store.dispatch(this.showLoadingDistpatcher);
        return this.maintenancesService.updateMaintenance(payload.maintenance).pipe(
          map(() => (new fromMaintenanceActions.UpdateMaintenanceSuccess(payload))),
          catchError(error => of(new fromMaintenanceActions.CreateMaintenanceError({ error })))
        );
      }),
    );

  @Effect()
  createMaintenance$ = this.actions$
    .pipe(
      ofType<fromMaintenanceActions.CreateMaintenance>(fromMaintenanceActions.MaintenanceActionTypes.CreateMaintenance),
      mergeMap(({ payload }) => {
        this.store.dispatch(this.showLoadingDistpatcher);
        return this.maintenancesService.createMaintenance(payload.maintenance).pipe(
          map(maintenance => (new fromMaintenanceActions.CreateMaintenanceSuccess({ maintenance }))),
          catchError(error => of(new fromMaintenanceActions.CreateMaintenanceError({ error })))
        );
      })
    );

  @Effect()
  createMaintenanceError$ = this.actions$
    .pipe(
      ofType<fromMaintenanceActions.CreateMaintenanceError>(fromMaintenanceActions.MaintenanceActionTypes.CreateMaintenanceError),
      map(() => {
        this.snackBar.open('Error', 'Ok', {
          duration: 2000,
          verticalPosition: 'top'
        });
      }),
      map(() => this.hideActionLoadingDistpatcher)
    );

  @Effect()
  createMaintenanceSuccess$ = this.actions$
    .pipe(
      ofType<fromMaintenanceActions.CreateMaintenanceSuccess>(fromMaintenanceActions.MaintenanceActionTypes.CreateMaintenanceSuccess),
      map(() => {
        this.snackBar.open('Success', 'Ok', {
          duration: 2000,
          verticalPosition: 'top'
        });
      }),
      map(() => this.hideActionLoadingDistpatcher)
    );

  @Effect()
  updateMaintenanceSuccess$ = this.actions$
    .pipe(
      ofType<fromMaintenanceActions.UpdateMaintenanceSuccess>(fromMaintenanceActions.MaintenanceActionTypes.UpdateMaintenanceSuccess),
      map(() => {
        this.snackBar.open('Success Update', 'Ok', {
          duration: 2000,
          verticalPosition: 'top'
        });
      }),
      map(() => this.hideActionLoadingDistpatcher)
    );

  @Effect({ dispatch: false })
  viewMaintenance$ = this.actions$
    .pipe(
      ofType<fromMaintenanceActions.ViewMaintenance>(fromMaintenanceActions.MaintenanceActionTypes.ViewMaintenance),
      map(({ payload }) => {
        return this.maintenancesViewService.openMaintenanceView(payload.id);
      }),
    );

  constructor(
    private actions$: Actions,
    private snackBar: MatSnackBar,
    private store: Store<AppState>,
    private maintenancesService: MaintenancesService,
    private maintenancesViewService: MaintenancesViewService,
  ) { }
}

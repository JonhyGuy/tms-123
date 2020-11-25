import * as fromTravelActions from '@actions/travel.actions';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { QueryParamsModel } from '@crud';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from '@reducers';
import { TravelsService } from '@services';
import { forkJoin, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

@Injectable()
export class TravelEffects {
  showPageLoadingDistpatcher = new fromTravelActions.TravelsPageToggleLoading({
    isLoading: true,
  });
  showLoadingDistpatcher = new fromTravelActions.TravelsPageToggleLoading({ isLoading: true });
  hideActionLoadingDistpatcher = new fromTravelActions.TravelsPageToggleLoading({
    isLoading: false,
  });

  @Effect()
  loadTravelsPage$ = this.actions$.pipe(
    ofType<fromTravelActions.RequestTravelsPage>(fromTravelActions.TravelActionTypes.RequestTravelsPage),
    mergeMap(({ payload }) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.travelsService.findTravels(
        payload.page
      );
      const lastQuery = of(payload.page);
      return forkJoin([requestToServer, lastQuery]);
    }),
    map((response) => {
      console.log(response);
      const result = response[0];
      const lastQuery: QueryParamsModel = response[1];
      return new fromTravelActions.LoadTravelsPage({
        travel: result,
        totalCount: result.length,
        page: lastQuery,
      });
    })
  );

  @Effect()
  deleteTravel$ = this.actions$.pipe(
    ofType<fromTravelActions.DeleteOneTravel>(fromTravelActions.TravelActionTypes.DeleteOneTravel),
    mergeMap(({ payload }) => {
      this.store.dispatch(this.showLoadingDistpatcher);
      return this.travelsService.deleteTravel(payload.id);
    }),
    map(() => {
      return this.hideActionLoadingDistpatcher;
    })
  );

  @Effect()
  deleteTravels$ = this.actions$.pipe(
    ofType<fromTravelActions.DeleteManyTravels>(fromTravelActions.TravelActionTypes.DeleteManyTravels),
    mergeMap(({ payload }) => {
      this.store.dispatch(this.showLoadingDistpatcher);
      return this.travelsService.deleteTravels(payload.ids);
    }),
    map(() => {
      return this.hideActionLoadingDistpatcher;
    })
  );

  @Effect()
  updateTravel$ = this.actions$.pipe(
    ofType<fromTravelActions.UpdateTravel>(fromTravelActions.TravelActionTypes.UpdateTravel),
    mergeMap(({ payload }) => {
      this.store.dispatch(this.showLoadingDistpatcher);
      return this.travelsService.updateTravel(payload.travel).pipe(
        map(() => (new fromTravelActions.UpdateTravelSuccess(payload))),
        catchError(error => of(new fromTravelActions.CreateTravelError({ error })))
      );
    })
  );

  @Effect()
  createTravel$ = this.actions$.pipe(
    ofType<fromTravelActions.CreateTravel>(fromTravelActions.TravelActionTypes.CreateTravel),
    mergeMap(({ payload }) => {
      this.store.dispatch(this.showLoadingDistpatcher);
      return this.travelsService.createTravel(payload.travel).pipe(
        map(travel => (new fromTravelActions.CreateTravelSuccess({ travel }))),
        catchError(error => of(new fromTravelActions.CreateTravelError({ error })))
      );
    }),
  );

  @Effect()
  createTravelError$ = this.actions$
    .pipe(
      ofType<fromTravelActions.CreateTravelError>(fromTravelActions.TravelActionTypes.CreateTravelError),
      map(() => {
        this.snackBar.open('Error', 'Ok', {
          duration: 2000,
          verticalPosition: 'top'
        });
      }),
      map(() => this.hideActionLoadingDistpatcher)
    );

  @Effect()
  createTravelSuccess$ = this.actions$
    .pipe(
      ofType<fromTravelActions.CreateTravelSuccess>(fromTravelActions.TravelActionTypes.CreateTravelSuccess),
      map(() => {
        this.snackBar.open('Success', 'Ok', {
          duration: 2000,
          verticalPosition: 'top'
        });
      }),
      map(() => this.hideActionLoadingDistpatcher)
    );

  @Effect()
  updateTravelSuccess = this.actions$
    .pipe(
      ofType<fromTravelActions.UpdateTravelSuccess>(fromTravelActions.TravelActionTypes.UpdateTravelSuccess),
      map(() => {
        this.snackBar.open('Success Update', 'Ok', {
          duration: 2000,
          verticalPosition: 'top'
        });
      }),
      map(() => this.hideActionLoadingDistpatcher)
    );

  constructor(
    private actions$: Actions,
    private travelsService: TravelsService,
    private store: Store<AppState>,
    private snackBar: MatSnackBar
  ) { }
}

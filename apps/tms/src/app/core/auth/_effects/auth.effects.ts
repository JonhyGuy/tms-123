// Angular
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NavigationEnd, Router } from '@angular/router';
// NGRX
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { LayoutUtilsService } from '@tms/crud';
import { defer, Observable, of } from 'rxjs';
// RxJS
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AppState } from '../../reducers';
// Auth actions
import * as fromAuthActions from '../_actions/auth.actions';


@Injectable()
export class AuthEffects {
  @Effect({
    dispatch: false
  })
  login$ = this.actions$.pipe(
    ofType<fromAuthActions.Login>(fromAuthActions.AuthActionTypes.Login),
    catchError(err => of([console.log(err)]))
  );

  @Effect({
    dispatch: false
  })
  logout$ = this.actions$.pipe(
    ofType<fromAuthActions.Logout>(fromAuthActions.AuthActionTypes.Logout),
    tap(() => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      this.router.navigate(['/auth/login'], {
      });
    })
  );

  @Effect({
    dispatch: false
  })
  loginSuccess$ = this.actions$.pipe(
    ofType<fromAuthActions.LoginSucces>(fromAuthActions.AuthActionTypes.LoginSucces),
    map(() => {
      this.snackBar.open('Success', 'Ok', {
        duration: 2000,
        verticalPosition: 'top'
      });
    })
  );

  @Effect({
    dispatch: false
  })
  register$ = this.actions$.pipe(
    ofType<fromAuthActions.Register>(fromAuthActions.AuthActionTypes.Register),
    tap(action => {
      localStorage.setItem(environment.authTokenKey, action.payload.accessToken);
    })
  );

  // @Effect({
  //   dispatch: false
  // })
  // loadUser$ = this.actions$
  //   .pipe(
  //     ofType<fromAuthActions.CompanyRequested>(fromAuthActions.AuthActionTypes.CompanyRequested),
  //     withLatestFrom(this.store.pipe(select(isCompanyLoaded))),
  //     filter(([action, _isCompanyLoaded]) => !_isCompanyLoaded),
  //     mergeMap(([action, _isUserLoaded]) => this.auth.getCompanyByToken()),
  //     tap(_company => {
  //       if (_company) {
  //         this.store.dispatch(new fromAuthActions.CompanyLoaded({
  //           company: _company
  //         }));
  //       } else {
  //         this.store.dispatch(new fromAuthActions.Logout());
  //       }
  //     })
  //   );

  @Effect()
  init$: Observable<Action> = defer(() => {
    const userToken = localStorage.getItem(environment.authTokenKey);
    let observableResult = of({
      type: 'NO_ACTION'
    });
    if (userToken) {
      observableResult = of(new fromAuthActions.Login({
        Success: 'Si hay token'
      }));
    }
    return observableResult;
  });

  private returnUrl: string;

  constructor(private actions$: Actions, private router: Router, private snackBar: MatSnackBar, private store: Store<AppState>, private layoutUtilsService: LayoutUtilsService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.returnUrl = event.url;
      }
    });
  }
}

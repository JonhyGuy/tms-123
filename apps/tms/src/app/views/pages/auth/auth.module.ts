import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ErrorDialogComponent } from '@tms/shared/dialogs/error-dialog/error-dialog.component';
import { ErrorDialogModule } from '@tms/shared/dialogs/error-dialog/error-dialog.module';
import { AuthEffects, authReducer } from '../../../core/auth';
import { AccountComponent } from './account/account.component';
import { AuthNoticeComponent } from './auth-notice/auth-notice.component';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ErrorDialogModule,
    ReactiveFormsModule,
    MatButtonModule,
    AuthRoutingModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    TranslateModule.forChild(),
    StoreModule.forFeature('auth', authReducer),
    EffectsModule.forFeature([AuthEffects])
  ],
  entryComponents: [
    ErrorDialogComponent
  ],
  exports: [AuthComponent],
  declarations: [
    AuthComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    AuthNoticeComponent,
    AccountComponent
  ]
})

export class AuthModule { }

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { CoreModule } from '@tms/core/core.module';
import { PartialsModule } from '../../partials/partials.module';
import { WizardComponent } from './wizard.component';
import { Wizard1Component } from './wizard1/wizard1.component';
import { Wizard2Component } from './wizard2/wizard2.component';
import { Wizard3Component } from './wizard3/wizard3.component';
import { Wizard4Component } from './wizard4/wizard4.component';

@NgModule({
  declarations: [
    WizardComponent,
    Wizard1Component,
    Wizard2Component,
    Wizard3Component,
    Wizard4Component
  ],
  imports: [
    CommonModule,
    FormsModule,
    PartialsModule,
    CoreModule,
    RouterModule.forChild([
      {
        path: '',
        component: WizardComponent,
        children: [
          {
            path: 'wizard-1',
            component: Wizard1Component
          },
          {
            path: 'wizard-2',
            component: Wizard2Component
          },
          {
            path: 'wizard-3',
            component: Wizard3Component
          },
          {
            path: 'wizard-4',
            component: Wizard4Component
          },
        ]
      },
    ]),
    MatSelectModule,
    MatInputModule
  ]
})
export class WizardModule {
}

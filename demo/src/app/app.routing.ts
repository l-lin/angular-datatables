import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WelcomeComponent } from './welcome.component';
import { GettingStartedComponent } from './getting-started.component';

import { ZeroConfigComponent } from './basic/zero-config.component';
import { WithOptionsComponent } from './basic/with-options.component';
import { WithAjaxComponent } from './basic/with-ajax.component';
import { AngularWayComponent } from './basic/angular-way.component';

import { DtInstanceComponent } from './advanced/dt-instance.component';
import { LoadDtOptionsWithPromiseComponent } from './advanced/load-dt-options-with-promise.component';
import { RerenderComponent } from './advanced/rerender.component';
import { RowClickEventComponent } from './advanced/row-click-event.component';

import { ButtonsExtensionComponent } from './extensions/buttons-extension.component';
import { ColreorderExtensionComponent } from './extensions/colreorder-extension.component';
import { SelectExtensionComponent } from './extensions/select-extension.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/welcome',
    pathMatch: 'full'
  },
  {
    path: 'welcome',
    component: WelcomeComponent
  },
  {
    path: 'getting-started',
    component: GettingStartedComponent
  },
  {
    path: 'basic/zero-config',
    component: ZeroConfigComponent
  },
  {
    path: 'basic/with-options',
    component: WithOptionsComponent
  },
  {
    path: 'basic/with-ajax',
    component: WithAjaxComponent
  },
  {
    path: 'basic/angular-way',
    component: AngularWayComponent
  },
  {
    path: 'advanced/dt-instance',
    component: DtInstanceComponent
  },
  {
    path: 'advanced/load-dt-options-with-promise',
    component: LoadDtOptionsWithPromiseComponent
  },
  {
    path: 'advanced/rerender',
    component: RerenderComponent
  },
  {
    path: 'advanced/row-click-event',
    component: RowClickEventComponent
  },
  {
    path: 'extensions/buttons',
    component: ButtonsExtensionComponent
  },
  {
    path: 'extensions/colreorder',
    component: ColreorderExtensionComponent
  },
  {
    path: 'extensions/select',
    component: SelectExtensionComponent
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, {useHash: true}) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}

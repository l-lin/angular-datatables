import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WelcomeComponent } from './welcome.component';
import { GettingStartedComponent } from './getting-started.component';

import { ZeroConfigComponent } from './basic/zero-config.component';
import { WithOptionsComponent } from './basic/with-options.component';
import { WithAjaxComponent } from './basic/with-ajax.component';

import { DtInstanceComponent } from './advanced/dt-instance.component';
import { RowClickEventComponent } from './advanced/row-click-event.component';

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
    path: 'advanced/dt-instance',
    component: DtInstanceComponent
  },
  {
    path: 'advanced/row-click-event',
    component: RowClickEventComponent
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, {useHash: true}) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WelcomeComponent } from './welcome.component';
import { GettingStartedComponent } from './getting-started.component';
import { PersonComponent } from './person.component';

import { ZeroConfigComponent } from './basic/zero-config.component';
import { WithOptionsComponent } from './basic/with-options.component';
import { WithAjaxComponent } from './basic/with-ajax.component';
import { AngularWayComponent } from './basic/angular-way.component';
import { ServerSideAngularWayComponent } from 'app/basic/server-side-angular-way.component';

import { CustomRangeSearchComponent } from './advanced/custom-range-search.component';
import { DtInstanceComponent } from './advanced/dt-instance.component';
import { IndividualColumnFilteringComponent } from './advanced/individual-column-filtering.component';
import { LoadDtOptionsWithPromiseComponent } from './advanced/load-dt-options-with-promise.component';
import { RerenderComponent } from './advanced/rerender.component';
import { RowClickEventComponent } from './advanced/row-click-event.component';
import { MultipleTablesComponent } from './advanced/multiple-tables.component';
import { RouterLinkComponent } from './advanced/router-link.component';

import { ButtonsExtensionComponent } from './extensions/buttons-extension.component';
import { ColreorderExtensionComponent } from './extensions/colreorder-extension.component';
import { ResponsiveExtensionComponent } from './extensions/responsive-extension.component';
import { SelectExtensionComponent } from './extensions/select-extension.component';
import { UsingNgPipeComponent } from './advanced/using-ng-pipe.component';
import { FAQComponent } from './f-a-q/f-a-q.component';

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
        path: 'person/:id',
        component: PersonComponent
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
        path: 'basic/server-side-angular-way',
        component: ServerSideAngularWayComponent
    },
    {
        path: 'advanced/custom-range-search',
        component: CustomRangeSearchComponent
    },
    {
        path: 'advanced/dt-instance',
        component: DtInstanceComponent
    },
    {
        path: 'advanced/individual-column-filtering',
        component: IndividualColumnFilteringComponent
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
        path: 'advanced/multiple-tables',
        component: MultipleTablesComponent
    },
    {
        path: 'advanced/router-link',
        component: RouterLinkComponent
    },
    {
        path: 'advanced/using-pipe',
        component: UsingNgPipeComponent
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
        path: 'extensions/responsive',
        component: ResponsiveExtensionComponent
    },
    {
        path: 'extensions/select',
        component: SelectExtensionComponent
    },
    {
        path: 'faq',
        component: FAQComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true, relativeLinkResolution: 'legacy' })],
    exports: [RouterModule]
})
export class AppRoutingModule { }

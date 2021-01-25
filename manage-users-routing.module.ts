import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoutingPath } from 'src/environments/routing-path';
import { ModifyUserComponent } from './pages/modify-user/modify-user.component';
import { AdminComponent } from '../manage-users/pages/admin/admin.component';
import { ConsultUserComponent } from './pages/consult-user/consult-user.component';
import { CreateComponent } from './pages/create/create.component';
import { CanDeactivateGuard } from 'src/app/shareds/form-validate/can-deactivate.guard';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: AdminComponent,
      },
      {
        path: RoutingPath.appRouting.components.dashboard.pages.administrator_user.pages.create.path,
        component: CreateComponent,
        canDeactivate: [CanDeactivateGuard],
        data: {
          breadcrumb: RoutingPath.appRouting.components.dashboard.pages.administrator_user.pages.create.breadcrumb,
          permits: RoutingPath.appRouting.components.dashboard.pages.administrator_user.pages.create.permits,
        }

      },
      {
        path: RoutingPath.appRouting.components.dashboard.pages.administrator_user.pages.modify.path,
        component: ModifyUserComponent,
        canDeactivate: [CanDeactivateGuard],
        data: {
          breadcrumb: {
            alias: RoutingPath.appRouting.components.dashboard.pages.administrator_user.alias,
            breadcrumb: RoutingPath.appRouting.components.dashboard.pages.administrator_user.pages.modify.breadcrumb
          },
          permits: RoutingPath.appRouting.components.dashboard.pages.administrator_user.pages.modify.permits
        },
      },
      {
        path: RoutingPath.appRouting.components.dashboard.pages.administrator_user.pages.consult.path,
        component: ConsultUserComponent,
        data: {
          breadcrumb: {
            alias: RoutingPath.appRouting.components.dashboard.pages.administrator_user.alias,
            breadcrumb: RoutingPath.appRouting.components.dashboard.pages.administrator_user.pages.consult.breadcrumb
          },
          permits: RoutingPath.appRouting.components.dashboard.pages.administrator_user.pages.consult.permits
        },
      },
      { path: '**', redirectTo: '/dashboard/' + RoutingPath.appRouting.components.dashboard.pages.administrator_user.path }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageUsersRoutingModule { }

import { NgModule } from '@angular/core';
import { loadRemoteModule } from '@angular-architects/module-federation';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: DashboardComponent
  },
  {
    path: 'customer',
    loadChildren: () =>
      loadRemoteModule({
        type: 'manifest',
        remoteName: 'customer',
        exposedModule: './Module',
      }).then((m) => {
        console.log('lazy load children');
        return m.OrderModule;
      }),
  },
  {
    path:'**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './admin-layout/home/home.component';
import {AuthModule} from "./auth/auth.module";
import {LayoutModule} from "./admin-layout/layout.module";

const routes: Routes = [
  {path:'',component:HomeComponent},
  { path: 'dashboard', loadChildren: () => import('./admin-layout/layout.module').then(m => m.LayoutModule) },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes),LayoutModule,AuthModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }

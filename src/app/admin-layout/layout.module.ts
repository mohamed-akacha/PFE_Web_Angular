import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ContentComponent } from './content/content.component';
import { NavbarComponent } from './navbar/navbar.component';
import {RouterModule, Routes} from '@angular/router';
import { HomeComponent } from './home/home.component';
import {UsersModule} from "../features/users/users.module";


const routes:Routes = [
 {
  path: '',
    component: HomeComponent,
    children: [
      { path: '', redirectTo: 'users', pathMatch: 'full' },
      {
        path: 'users',
        loadChildren: () => import('../features/users/users.module').then(m => m.UsersModule)
      },
      {
        path: 'hospitals',
        loadChildren: () => import('../features/hospital/hospital.module').then(m => m.HospitalModule)
      },
      {
        path: 'inspections',
        loadChildren: () => import('../features/inspections/inspections.module').then(m => m.InspectionsModule)
      }
      ,
      {
        path: 'contracts',
        loadChildren: () => import('../features/contract/contract.module').then(m => m.ContractModule)
      }

    ]
    }
]

@NgModule({
  declarations: [SidebarComponent, ContentComponent, NavbarComponent, HomeComponent],
  imports: [
    CommonModule,RouterModule,RouterModule.forChild(routes),UsersModule
  ],
  exports:[SidebarComponent, ContentComponent, NavbarComponent]
})
export class LayoutModule { }

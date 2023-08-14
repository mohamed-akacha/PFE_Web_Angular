import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZoneListComponent } from './zone-list/zone-list.component';
import { InstitutionListComponent } from './institution-list/institution-list.component';
import {RouterModule, Routes} from "@angular/router";
import {UserListComponent} from "../users/user-list/user-list.component";
import {FormsModule} from "@angular/forms";


const routes:Routes = [
  { path: '', component: InstitutionListComponent },
  { path: 'zones', component: ZoneListComponent },
  { path: 'institutions', component: InstitutionListComponent }
];
@NgModule({
  declarations: [
    ZoneListComponent,
    InstitutionListComponent
  ],
  imports: [
    CommonModule,RouterModule.forChild(routes),FormsModule
  ]
})
export class HospitalModule { }

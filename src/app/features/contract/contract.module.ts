import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubcontractorListComponent } from './subcontractor-list/subcontractor-list.component';
import { ContractListComponent } from './contract-list/contract-list.component';
import {RouterModule, Routes} from "@angular/router";
import {ZoneListComponent} from "../hospital/zone-list/zone-list.component";
import {InstitutionListComponent} from "../hospital/institution-list/institution-list.component";
import {FormsModule} from "@angular/forms";


const routes:Routes = [
  { path: 'subcontractor', component: SubcontractorListComponent },
  { path: 'contrats', component: ContractListComponent },
];
@NgModule({
  declarations: [
    SubcontractorListComponent,
    ContractListComponent
  ],
  imports: [
    CommonModule,RouterModule.forChild(routes),FormsModule
  ],
  exports:[SubcontractorListComponent]
})
export class ContractModule { }

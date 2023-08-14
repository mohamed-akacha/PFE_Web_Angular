import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CriteiaListComponent } from './criteia-list/criteia-list.component';
import {RouterModule, Routes} from "@angular/router";
import {FormsModule} from "@angular/forms";
import { PlanningComponent } from './planning/planning.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { InspectionDetailComponent } from './inspection-detail/inspection-detail.component';


const routes:Routes = [
  { path: '', component: PlanningComponent },
  { path: 'criteres', component: CriteiaListComponent },
  { path: 'planning', component: PlanningComponent },
  { path: 'inspection-details/:id', component: InspectionDetailComponent }
];
@NgModule({
  declarations: [
    CriteiaListComponent,
    PlanningComponent,
    InspectionDetailComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    FullCalendarModule
  ],
  exports:[CriteiaListComponent,PlanningComponent]
})
export class InspectionsModule { }

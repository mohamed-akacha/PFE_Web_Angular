import {ChangeDetectorRef, Component} from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import {Duration} from "ngx-bootstrap/chronos/duration/constructor";
import {  DateSelectArg, EventClickArg, EventApi,EventSourceInput } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import {createEventId, INITIAL_EVENTS} from "./event-utils";
import {ZoneService} from "../../../core/services/ZoneService";
import {Zone} from "../../../core/models/Zone";
import {InstitutionService} from "../../../core/services/institution.service";
import {Institution} from "../../../core/models/institution";
import {InspectionsService} from "../../../core/services/inspections.service";
import {User} from "../../../core/models/User";
import {UsersService} from "../../../core/services/users.service";
import {InspectionUnit} from "../../../core/models/InspectionUnit";
import {InspectionUnitService} from "../../../core/services/inspection-unit.service";
import {CreateInspectionDto} from "../../../core/models/Inspection";


@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.scss']
})
export class PlanningComponent {
  //Calendrier
  calendarVisible = false;
  events:EventSourceInput=[];
  calendarOptions: CalendarOptions = {
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },

    initialView: 'dayGridMonth',
    initialEvents: [], // Remove the initialEvents property
    events: this.events, // Add the events property
    weekends: true,
    locale:'en-Us',
    hiddenDays:[5,6],
    editable: true,
    selectable: true,
    selectMirror: true,
    selectConstraint:{
      start:new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
    },
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    //eventRemove:this.handleDeleteEvent.bind(this)
    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
  };
  currentEvents: EventApi[] = [];
  selectInfo!: DateSelectArg;
  //Modals status
  updateInProgress: any;
  editFormShow: boolean=false;
  deleteConfirmationFormShow: boolean=false;
  createFormShow: boolean=false;
  deleteConfirmationMessage: any;


  //Zone
  selectedZone: number=-1;
  zoneName: string="";
  zones: Zone[]=[];
  //institution
  selectedInstitution: number=-1;
  institutions: Institution[]=[];
  insppectionUnits:InspectionUnit[]=[];

  //Event
  description: string="";
  date_prevue: string="";
  user: number=0;
  users: User[]=[];
  type_inspec: string="";
  selectedUnit:number=-1;

  constructor(private inspecService:InspectionsService,private zoneService:ZoneService,
              private institutionService: InstitutionService,private userService: UsersService,
              private unitService:InspectionUnitService,private changeDetector: ChangeDetectorRef)
  {
    this.zoneService.getAllZones().subscribe(data=>{
      this.zones=data;
    });
    this.userService.getAllUsers('user',"no").subscribe(data=>{
      this.users=data;
    })
  }

  ngOnInit():void {

  }

  handleWeekendsToggle() {
    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    if(this.selectedInstitution>-1)
    {
      this.createFormShow=true;
      this.updateInProgress=true;
      this.selectInfo=selectInfo;
      this.date_prevue=this.selectInfo.startStr
    }else{
      alert("You should select an institution")
    }

  }

  handleEventClick(clickInfo: EventClickArg) {}

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
    this.changeDetector.detectChanges();
  }

  filterEvents() {
    if(this.selectedZone!==-1){
      this.institutionService.getInstitutionsByZone(this.selectedZone).subscribe(data=>{
        this.institutions=data;
      })
    }
  }

  confirmCreateAction() {
    console.log(JSON.stringify(this.user))
    const title = this.description;
    const calendarApi = this.selectInfo.view.calendar;
    calendarApi.unselect(); // clear date selection
    if (title && title.trim()!=="") {

      const inspecData:CreateInspectionDto={
        datePrevue:this.date_prevue.slice(0,10),
        description:title,
        type:this.type_inspec.toLowerCase(),
        inspecteurId:Number(this.user),
        unitId:Number(this.selectedUnit)
      }
      alert(JSON.stringify(inspecData))
      this.inspecService.createInspection(inspecData).subscribe(response=>{
        calendarApi.addEvent({
          id: this.user.toString(),
          title:this.user.toString()+"_"+title,
          start: this.selectInfo.startStr,
          end: this.selectInfo.endStr,
          allDay: this.selectInfo.allDay,
          color:"red",
          url:`/dashboard/inspections/inspection-details/${this.user}`
        });
      })
      this.createFormShow=false;
      this.updateInProgress=false;

    }
  }

  cancelCreateAction() {
    this.createFormShow=false;
    this.updateInProgress=false;
  }

  load() {
    if(this.selectedInstitution!==-1){
      this.unitService.getUnitsByInstitution(this.selectedInstitution).subscribe(data=>{
        this.insppectionUnits=data;
      })
      this.inspecService.getAllInspectionsByInst(this.selectedInstitution).subscribe(data=>{
        this.events =  data.map(element => ({

          id:element.id.toString(),
          title: element.id.toString()+"_"+element.description,
          start: element.datePrevue,
          end: element.datePrevue,
          allDay: true,
          color: element.statut === true ? "green" : "orange",
          url: `/dashboard/inspections/inspection-details/${element.id}`,
        }));
        alert(JSON.stringify(this.events))
        if (this.calendarOptions) {
          this.calendarOptions.events = this.events;
        }
      })
    }else{
      alert("You should select an institution before!")
    }
  }
}

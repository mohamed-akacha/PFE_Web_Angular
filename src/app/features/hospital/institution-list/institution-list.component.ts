import { Component } from '@angular/core';
import {UpdateZoneDto, Zone} from "../../../core/models/Zone";
import {ZoneService} from "../../../core/services/ZoneService";
import {Router} from "@angular/router";
import {Institution, UpdateInstitutionDto} from "../../../core/models/institution";
import {InstitutionService} from "../../../core/services/institution.service";
import {CreateInspectionUnitDto, InspectionUnit} from "../../../core/models/InspectionUnit";
import {Bloc, CreateBlocDto} from "../../../core/models/Bloc";
import {BlocService} from "../../../core/services/bloc.service";
import {InspectionUnitService} from "../../../core/services/inspection-unit.service";

declare var $: any;
@Component({
  selector: 'app-institution-list',
  templateUrl: './institution-list.component.html',
  styleUrls: ['./institution-list.component.scss']
})
export class InstitutionListComponent {
  //info zone
  userId: number=0;
  zoneName:string="";
  //lists vars
  editFormShow:boolean=false;
  unitFormShow: boolean=false;
  blocFormShow:boolean=false;
  //modals vars
  confirmationFormShow: boolean=false;
  confirmationMessage: string="";
  deleteConfirmationMessage: string="";
  deleteConfirmationFormShow: boolean=false;
  createFormShow: boolean=false;
  updateInProgress: boolean=false;

  createUIFormShow: boolean=false;
  //lists
  allZones: Zone[]=[];
  allInstitutions: Institution[]=[]
  allUnits:InspectionUnit[]=[]
  allBlocs:Bloc[]=[]
  //Datatable HTML update
  rowIndex: number=-1;
  status: any;
  selectedZone: number=-1;

  instName: string="";
  instAdr: string="";
  instNature: string="";

  uiName: string="";
  uiCode: string="";
  uiID: number=0;

  constructor(private blocService:BlocService,private zoneService: ZoneService,
              private instService: InstitutionService,private unitServuce:InspectionUnitService) {}

  ngOnInit(): void {
      this.instService.getAllInstitutionsA().subscribe(data1=>{
        this.initializeDataTable(data1);
      })
    this.zoneService.getAllZones().subscribe(data => {
      this.allZones = data;
    });
  }
  initializeDataTable(data: any[]): void {
    $('#ZonesTable').DataTable().clear();
    $('#ZonesTable tbody').empty();
    var groupColumn = 3; // Index of the column to group by (0-based index)
    var table = $('#ZonesTable').DataTable({
      responsive: true,
      destroy:true,
      lengthChange: false,
      autoWidth: false,
      select: true,
      data: data,
      columns: [
        { data: 'nom' },
        { data: 'nature' },
        { data: 'adresse' },
        { data: 'zone' },
        { data: 'numberOfInspectionUnits' },
        { data: null, render: function (data: any, type: any, row: { id: any; deletedAt: any; }) {
            return `
            <div class="d-flex align-items-center">
              <a class="btn-update btn-outline-primary"  data-userid="${row.id}"><i class="fas fa-edit"></i></a>
            </div>
          `;
          }},
        {data: null, render: function (data: any, type: any, row: { id: any; deletedAt: any; }) {
            return `
            <div class="d-flex align-items-center">
              <a class="btn-del mr-3 btn-outline-danger" style="color:#ff5b5b" data-userid="${row.id}"><i class="fas fa-trash"></i></a>
            </div>
          `;
          }},
        {data: null, render: function (data: any, type: any, row: { id: any; deletedAt: any; }) {

            return `
            <div class="d-flex align-items-center">
              <a class="btn-ui btn btn-outline-secondary"  data-userid="${row.id}">Unités</a>
            </div>
          `;
          }}
      ],
      drawCallback: function (settings:any) {
        var api = this.api();
        var rows = api.rows({ page: 'current' }).nodes();
        var last: string | null = null;
        api.column(groupColumn, { page: 'current' })
          .data()
          .each(function (group:string, i:number) {
            if (last !== group) {
              $(rows)
                .eq(i)
                .before('<tr style="background-color: #0056b3;color: #fff" ><td style="background-color: #0056b3" colspan="8">' + group + '</td></tr>');

              last = group;
            }
          });
      }
    });

    new $.fn.dataTable.Buttons(table, {
      buttons: ['copy', 'excel', 'pdf', 'print']
    }).container().appendTo('#ZonesTable_wrapper .col-md-6:eq(0)');

    $('#ZonesTable').on('click', '.btn-update', (event: { currentTarget: any; preventDefault: () => void; }) => {
      event.preventDefault();
      const userId = $(event.currentTarget).data('userid');
      const rowIndex = $(event.currentTarget).closest('tr').index();
      this.updateInProgress = true;
      this.onUserUpdateBtnClick(userId, rowIndex);
    });
    //
    $('#ZonesTable').on('click', '.btn-del', (event: { currentTarget: any; preventDefault: () => void; }) => {
      event.preventDefault();
      const userId = $(event.currentTarget).data('userid');
      const rowIndex = $(event.currentTarget).closest('tr').index();
      this.updateInProgress = true;
      this.onUserDeleteBtnClick(userId, rowIndex);
    });

    $('#ZonesTable').on('click', '.btn-ui', (event: { currentTarget: any; preventDefault: () => void; }) => {
      event.preventDefault();

      const userId = $(event.currentTarget).data('userid');
      this.userId=userId;
      const rowIndex = $(event.currentTarget).closest('tr').index();
      this.onUserUIBtnClick(userId, rowIndex);
    });
  }
  initializeUIDataTable(uid:Number,data: any[]): void {
    $('#units').DataTable().clear();
    $('#units tbody').empty();
    var table = $('#units').DataTable({
      responsive: true,
      destroy:true,
      lengthChange: false,
      autoWidth: false,
      select: true,
      data: data,
      columns: [
        { data: 'nom' },
        { data: 'code' },
        {data: null, render: function (data: any, type: any, row: { id: any; deletedAt: any;numberOfBlocs:number }) {
            return `
            <div class="d-flex align-items-center">
              <a class="btn-bl btn btn-outline-secondary"  data-userid="${row.id}">${row.numberOfBlocs} Bloc(s)</a>
            </div>
          `;
          }},
        { data: null, render: function (data: any, type: any, row: { id: any; deletedAt: any; }) {
            return `
            <div class="d-flex align-items-center">
              <a class="btn-update btn-outline-primary"  data-userid="${row.id}"><i class="fas fa-edit"></i></a>
            </div>
          `;
          }},
        {data: null, render: function (data: any, type: any, row: { id: any; deletedAt: any; }) {
            return `
            <div class="d-flex align-items-center">
              <a class="btn-del mr-3 btn-outline-danger" style="color:#ff5b5b" data-userid="${row.id}"><i class="fas fa-trash"></i></a>
            </div>
          `;
          }}
      ]
    });
    $('#units').on('click', '.btn-bl', (event: { currentTarget: any; preventDefault: () => void; }) => {
      event.preventDefault();
      const userId = $(event.currentTarget).data('userid');
      this.uiID=userId;
      this.blocFormShow=true
      const rowIndex = $(event.currentTarget).closest('tr').index();
      this.onUserBLBtnClick(userId, rowIndex);
    });
  }
  initializeBlocsDataTable(uid:Number,data: any[]): void {
    $('#blocs').DataTable().clear();
    $('#blocs tbody').empty();
    var table = $('#blocs').DataTable({
      responsive: true,
      destroy:true,
      lengthChange: false,
      autoWidth: false,
      select: true,
      data: data,
      columns: [
        { data: 'nom' },
        { data: 'code' },
        { data: 'etage' },
        { data: null, render: function (data: any, type: any, row: { id: any; deletedAt: any; }) {
            return `
            <div class="d-flex align-items-center">
              <a class="btn-update btn-outline-primary"  data-userid="${row.id}"><i class="fas fa-edit"></i></a>
            </div>
          `;
        }},
        {data: null, render: function (data: any, type: any, row: { id: any; deletedAt: any; }) {
            return `
            <div class="d-flex align-items-center">
              <a class="btn-del mr-3 btn-outline-danger" style="color:#ff5b5b" data-userid="${row.id}"><i class="fas fa-trash"></i></a>
            </div>
          `;
          }}
      ]
    });
  }



  //Update process
  onUserUpdateBtnClick(userId: number, rowIndex: number) {
    this.instService.getInstitutionsById(userId).subscribe(data => {
      this.userId = userId;
      this.instName = data.nom;
      this.instNature=data.nature;
      this.instAdr=data.adresse;
      this.editFormShow = true;
      this.rowIndex = rowIndex;
    })
  }
  confirmUpdateAction() {
    const userData: UpdateInstitutionDto = {
      nom: this.instName,
      adresse:this.instAdr,
      nature:this.instNature
    };
    this.instService.updateInstitution(this.userId,userData).subscribe(response => {
        this.instService.getAllInstitutionsA().subscribe(data => {
          this.allInstitutions = data;
          this.initializeDataTable(data);
        });
        this.zoneName=""
        this.editFormShow = false;
        this.updateInProgress=false;
      },
      error => {
        // Handle any errors that occurred during the update
        console.error('Error updating user:', error);
      }
    );
  }
  cancelUpdateAction(){
    this.editFormShow = false;
    this.updateInProgress=false;
  }

  //Delete process
  onUserDeleteBtnClick(userId: number, rowIndex: number) {
    this.instService.getInstitutionsById(userId).subscribe(data => {
      this.userId = userId;
      this.instName = data.nom;
      this.deleteConfirmationFormShow = true;
      this.rowIndex = rowIndex;
      this.deleteConfirmationMessage=`Do you really want to permanently delete: ${this.instName}`

    })
  }
  confirmDeleteAction() {
    this.instService.deleteInstitution(this.userId).subscribe(response => {
      this.deleteConfirmationFormShow = false;
      this.updateInProgress=false;
      this.instService.getAllInstitutionsA().subscribe(data => {
        this.allInstitutions = data;
        this.initializeDataTable(data);
      });
    })
  }
  cancelDeleteAction() {
    this.deleteConfirmationFormShow = false;
    this.updateInProgress=false;
  }

  //Creation process
  createBLFormShow: boolean=false;
  blName: any;
  blCode: any;
  blFloor: any;




  onUserCreateBtnClick() {
    this.createFormShow=true;
    this.updateInProgress=true;
  }
  confirmCreateAction() {
    const userData={
      nom: this.instName,
      adresse: this.instAdr,
      nature: this.instNature,
      zoneId: this.selectedZone
    }
    this.instService.createInstitution(userData).subscribe(response => {
      this.instService.getAllInstitutionsA().subscribe(data => {
        this.allInstitutions = data;
        this.initializeDataTable(data);
      });
      this.instNature="";
      this.instAdr="";
      this.instName="";
      this.createFormShow=false;
      this.updateInProgress=false;

    });
  }
  cancelCreateAction() {
    this.createFormShow = false;
    this.updateInProgress=false;
  }


 onUserUIBtnClick(userId: number, rowIndex: number) {
    this.unitServuce.getUnitsByInstitution(this.userId).subscribe(data1=>{
      if(data1)
        this.initializeUIDataTable(this.userId,data1);

    })
    this.unitFormShow=true;
  }

  onUIRetour() {
    this.unitFormShow=false;
    //this.blocFormShow=false;
  }

  confirmCreateUIAction() {
    const instData:CreateInspectionUnitDto ={
      nom: this.uiName,
      code: this.uiCode,
      institutionId: this.userId
    }

    this.unitServuce.addUI(instData).subscribe(response=>{
      this.unitServuce.getUnitsByInstitution(this.userId).subscribe(data1=>{
        if(data1)
          this.initializeUIDataTable(this.userId,data1);

      })
      this.createUIFormShow=false;
      this.updateInProgress=false;
    })
  }

  cancelCreateUIAction() {
    this.createUIFormShow=false;
    this.updateInProgress=false;
  }

  onUserCreateUIBtnClick() {
    this.createUIFormShow=true;
    this.updateInProgress=true;
  }

  private onUserBLBtnClick(userId: any, rowIndex: any) {
    this.blocService.getBlocsByUI(this.uiID).subscribe(data1=>{
      if(data1)
        this.initializeBlocsDataTable(this.userId,data1);
    })
    this.blocFormShow=true;
    this.unitFormShow=false;
  }

  onBLRetour() {
    this.unitFormShow=true;
    this.blocFormShow=false;
  }

  onUserCreateBLBtnClick() {
    this.createBLFormShow=true;
    this.updateInProgress=true;
  }

  confirmCreateBLAction() {
    const blocData:CreateBlocDto={
      nom:this.blName,
      code:this.blCode,
      etage:this.blFloor,
      inspectionUnitId:this.uiID
    }
    this.blocService.createBloc(blocData).subscribe(response=>{
      this.blocService.getBlocsByUI(this.uiID).subscribe(data1=>{
        if(data1)
          this.initializeBlocsDataTable(this.userId,data1);
      })
      this.createBLFormShow=false
      this.updateInProgress=false

    })
  }

  cancelCreateBLAction() {
    this.createBLFormShow=false;
    this.updateInProgress=false;
  }
}

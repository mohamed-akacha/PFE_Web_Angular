import { Component } from '@angular/core';
import {ZoneService} from "../../../core/services/ZoneService";
import {Router} from "@angular/router";
import {UpdateZoneDto, Zone} from "../../../core/models/Zone";

declare var $: any;
@Component({
  selector: 'app-zone-list',
  templateUrl: './zone-list.component.html',
  styleUrls: ['./zone-list.component.scss']
})
export class ZoneListComponent {
  //info zone
  userId: number=0;
  zoneName:string="";
  //modals vars
  editFormShow:boolean=false;
  confirmationFormShow: boolean=false;
  confirmationMessage: string="";
  deleteConfirmationMessage: string="";
  deleteConfirmationFormShow: boolean=false;
  createFormShow: boolean=false;
  updateInProgress: boolean=false;
  allZones: Zone[]=[];
  //Datatable HTML update
  rowIndex: number=-1;
  status: any;


  constructor(private zoneService: ZoneService,private router: Router,) {}
  ngOnInit(): void {
    this.zoneService.getAllZones().subscribe(data => {
      this.allZones = data;
      this.initializeDataTable(data);
    });

  }
  initializeDataTable(data: any[]): void {
    $('#ZonesTable').DataTable().clear();
    $('#ZonesTable tbody').empty();
    var table = $('#ZonesTable').DataTable({
      responsive: true,
      destroy:true,
      lengthChange: false,
      autoWidth: false,
      select: true,
      data: data,
      columns: [
        { data: 'nom' },
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

    $('#ZonesTable').on('click', '.btn-del', (event: { currentTarget: any; preventDefault: () => void; }) => {
      event.preventDefault();
      const userId = $(event.currentTarget).data('userid');
      const rowIndex = $(event.currentTarget).closest('tr').index();
      this.updateInProgress = true;
      this.onUserDeleteBtnClick(userId, rowIndex);
    });
  }
  //Update process
  onUserUpdateBtnClick(userId: number, rowIndex: number) {
    this.zoneService.getZoneByID(userId).subscribe(({id, nom}) => {
      this.userId = id;
      this.zoneName = nom;
      this.editFormShow = true;
      this.rowIndex = rowIndex;
    })
  }
  confirmUpdateAction() {
    const userData: UpdateZoneDto = {
      nom: this.zoneName
    };
    this.zoneService.updateZone(this.userId,userData).subscribe(
      response => {
        // Handle the successful update response
        this.zoneService.getAllZones().subscribe(data => {
          this.allZones = data;
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
    this.zoneService.getZoneByID(userId).subscribe(({id, nom}) => {
      this.userId = id;
      this.zoneName = nom;
      this.deleteConfirmationFormShow = true;
      this.rowIndex = rowIndex;
      this.deleteConfirmationMessage=`Do you really want to permanently delete: ${this.zoneName}`

    })
  }
  confirmDeleteAction() {
    this.zoneService.deleteZone(this.userId).subscribe(response => {
      this.deleteConfirmationFormShow = false;
      this.updateInProgress=false;
      this.zoneService.getAllZones().subscribe(data => {
        this.allZones = data;
        this.initializeDataTable(data);
      });
    })
  }
  cancelDeleteAction() {
    this.deleteConfirmationFormShow = false;
    this.updateInProgress=false;
  }

  //Creation process
  onUserCreateBtnClick() {
    this.createFormShow=true;
    this.updateInProgress=true;
  }
  confirmCreateAction() {
    const userData={nom:this.zoneName}
    this.zoneService.createZone(userData).subscribe(response => {
      console.log(response)
      this.zoneService.getAllZones().subscribe(data => {
        this.allZones = data;
        this.initializeDataTable(data);
      });
      this.zoneName="";
      this.createFormShow=false;
      this.updateInProgress=false;

    });
  }
  cancelCreateAction() {
    this.createFormShow = false;
    this.updateInProgress=false;
  }

}

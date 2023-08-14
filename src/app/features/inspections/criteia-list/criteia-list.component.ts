import { Component } from '@angular/core';
import {UpdateZoneDto, Zone} from "../../../core/models/Zone";
import {ZoneService} from "../../../core/services/ZoneService";
import {Router} from "@angular/router";
import {CritereService} from "../../../core/services/critere.service";
import {UpdateEvaluationPointDto} from "../../../core/models/critere";

declare var $: any;
@Component({
  selector: 'app-criteia-list',
  templateUrl: './criteia-list.component.html',
  styleUrls: ['./criteia-list.component.scss']
})
export class CriteiaListComponent {
  activeTab: string = 'interne';
  //info zone
  userId: number=0;
  criteria:string="";
  type:string="";
  //modals vars
  editFormShow:boolean=false;
  confirmationFormShow: boolean=false;
  confirmationMessage: string="";
  deleteConfirmationMessage: string="";
  deleteConfirmationFormShow: boolean=false;
  createFormShow: boolean=false;
  updateInProgress: boolean=false;
  allInternes: { id:number,description:string,type:string }[]=[]
  allExternes: { id:number,description:string,type:string }[]=[];
  //Datatable HTML update
  rowIndex: number=-1;
  status: any;

  constructor(private critereService: CritereService,private router: Router,) {}

  ngOnInit(): void {
    this.loadCriteres();

  }
  loadCriteres(): void {
    const type = this.activeTab === 'interne' ? 'interne' : 'externe';
    this.critereService.getAllCriteres(type).subscribe((data) => {
      if (type === 'interne') {
        this.allInternes = data.filter((s) => s.type === 'interne');
        this.initializeDataTable('#internesTable', this.allInternes);
      } else {
        this.allExternes = data.filter((s) => s.type === 'externe');
        this.initializeDataTable('#externesTable', this.allExternes);
      }
    });
  }
  changeTab(tab: string): void {
    this.activeTab = tab;
    this.loadCriteres();
  }

  initializeDataTable(tableId:string,data: any[]): void {
    $(tableId).DataTable().clear();
    $(tableId+' tbody').empty();
    var table = $(tableId).DataTable({
      responsive: true,
      destroy:true,
      lengthChange: false,
      autoWidth: false,
      select: true,
      data: data,
      columns: [
        { data: 'description' },
        { data: null, render: function (data: any, type: any, row: { id: any; type: any; }) {
            return `
            <div class="d-flex align-items-center">
              <a class="btn-update btn-outline-primary" data-type="${row.type}"  data-userid="${row.id}"><i class="fas fa-edit"></i></a>
            </div>
          `;
          }},
        {data: null, render: function (data: any, type: any, row: { id: any; type: any; }) {
            return `
            <div class="d-flex align-items-center">
              <a class="btn-del mr-3 btn-outline-danger" style="color:#ff5b5b" data-type="${row.type}"  data-userid="${row.id}"><i class="fas fa-trash"></i></a>
            </div>
          `;
          }}
      ]
    });

    new $.fn.dataTable.Buttons(table, {
      buttons: ['copy', 'excel', 'pdf', 'print']
    }).container().appendTo(tableId+'_wrapper .col-md-6:eq(0)');

    $(tableId).on('click', '.btn-update', (event: { currentTarget: any; preventDefault: () => void; }) => {
      event.preventDefault();
      const userId = $(event.currentTarget).data('userid');
      const tp=$(event.currentTarget).data('type');
      const tableType = tableId === '#internesTable' ? 'interne' : 'externe';
      this.type=tableType;
      const rowIndex = $(event.currentTarget).closest('tr').index();
      this.updateInProgress = true;
      console.log(userId, rowIndex,tableType)
      this.onUserUpdateBtnClick(userId, rowIndex,tableType);
    });
    //
    $(tableId).on('click', '.btn-del', (event: { currentTarget: any; preventDefault: () => void; }) => {
      event.preventDefault();
      const userId = $(event.currentTarget).data('userid');
      const type=$(event.currentTarget).data('type');
      const rowIndex = $(event.currentTarget).closest('tr').index();
      this.updateInProgress = true;
      this.onUserDeleteBtnClick(userId, rowIndex,type);
    });
  }

  //Update process
  onUserUpdateBtnClick(userId: number, rowIndex: number, tp: string) {
    this.critereService.getCritereByID(userId).subscribe(data2 => {
      console.log(JSON.stringify(data2))
      this.userId = data2.id;
      this.criteria = data2.description;
      this.type = tp;
      this.rowIndex = rowIndex;
      // Check if the clicked tab matches the active tab
        this.editFormShow = true;
        this.updateInProgress=true;

    });
  }
  confirmUpdateAction() {
    const userData: UpdateEvaluationPointDto = {
      description: this.criteria,
      type: this.type,
    };
    this.critereService.updateCritere(this.userId, userData).subscribe(
      (response) => {
        this.loadCriteres(); // Reload criteres after updating
        this.criteria = '';
        this.editFormShow = false;
        this.updateInProgress = false;
      },
      (error) => {
        console.error('Error updating user:', error);
      }
    );
  }
  cancelUpdateAction(){
    this.editFormShow = false;
    this.updateInProgress=false;
    this.userId = 0;
    this.criteria = "";
    this.type="";
    this.rowIndex = -1;
  }

  //Delete process
  onUserDeleteBtnClick(userId: number, rowIndex: number,tp:string) {
    this.critereService.getCritereByID(userId).subscribe(({id, description,type}) => {
      this.userId = id;
      this.criteria = description;
      this.type=tp;
      this.deleteConfirmationFormShow = true;
      this.rowIndex = rowIndex;
      this.deleteConfirmationMessage=`Do you really want to permanently delete: ${this.criteria}`

    })
  }
  confirmDeleteAction() {
    const type = this.type; // Store the type in a separate variable
    this.critereService.deleteCritere(this.userId).subscribe(response => {
      this.critereService.getAllCriteres(type).subscribe(data => {
        if (type === 'interne') {
          this.allInternes = data.filter(s => s.type === "interne");
          this.initializeDataTable("#internesTable", this.allInternes);
        } else {
          this.allExternes = data.filter(s => s.type === "externe");
          this.initializeDataTable("#externesTable", this.allExternes);
        }
      });
      this.deleteConfirmationFormShow = false;
      this.updateInProgress = false;
      this.type = ""; // Clear the type property
    });
  }
  cancelDeleteAction() {
    this.deleteConfirmationFormShow = false;
    this.updateInProgress=false;
  }

  //Creation process
  onUserCreateBtnClick(type:string) {
    this.createFormShow=true;
    this.updateInProgress=true;
    this.type=type;
  }
  confirmCreateAction() {
    const userData={description:this.criteria,type:this.type}
    this.critereService.createCritere(userData).subscribe(response => {
      this.critereService.getAllCriteres(this.type).subscribe(data => {
        if(this.type==='interne'){
          this.allInternes = data.filter(s=>s.type==="interne");
          this.initializeDataTable("#internesTable",this.allInternes);
        }else{
          this.allExternes = data.filter(s=>s.type==="externe");
          this.initializeDataTable("#externesTable",this.allExternes);
        }
      });
      this.criteria="";
      this.createFormShow=false;
      this.updateInProgress=false;

    });
  }
  cancelCreateAction() {
    this.createFormShow = false;
    this.updateInProgress=false;
  }



}

import { Component } from '@angular/core';
import {Contract, CreateContratDto} from "../../../core/models/contract";
import {Institution} from "../../../core/models/institution";
import {Subcontractor} from "../../../core/models/Subcontractor";
import {SubcontractorService} from "../../../core/services/subcontractor.service";
import {InstitutionService} from "../../../core/services/institution.service";
import {ContractService} from "../../../core/services/contract.service";
import {ZoneService} from "../../../core/services/ZoneService";
import {Router} from "@angular/router";
import { areIntervalsOverlapping } from "date-fns";
import {Zone} from "../../../core/models/Zone";
import {NgForm} from "@angular/forms";


declare var $: any;
@Component({
  selector: 'app-contract-list',
  templateUrl: './contract-list.component.html',
  styleUrls: ['./contract-list.component.scss']
})
export class ContractListComponent {
  //info zone
  userId: number=0;
  zoneName:string="";
  institutionName:string="";
  subContractorName:string="";
  subContractorContact:string="";
  contractStart:Date=new Date();
  contractEnd:string="";
  contractPeriod:number=1;
  //modals vars
  editFormShow:boolean=false;
  confirmationFormShow: boolean=false;
  confirmationMessage: string="";
  deleteConfirmationMessage: string="";
  deleteConfirmationFormShow: boolean=false;
  createFormShow: boolean=false;
  updateInProgress: boolean=false;
  allContracts: Contract[]=[];
  //Datatable HTML update
  rowIndex: number=-1;
  status: any;
  contractForm: any;
  institutions: Institution[]=[];
  selectedSubcontractor!: Subcontractor;
  subcontractors: Subcontractor[]=[];
  zones: Zone[]=[];
  selectedInstitution: number=-1;
  selectedZone: number=-1;
  errorMessage: string="";
  constructor(private subcontractorService:SubcontractorService, private institutionService:InstitutionService,private  zoneService:ZoneService,private contractService: ContractService,private router: Router,) {
    this.zoneService.getAllZones().subscribe(data=>{

      this.zones=data;
    });
    this.subcontractorService.getAllSubcontractors().subscribe(data=>{
      this.subcontractors=data;
    })
  }
  filterEvents() {
    if(this.selectedZone!==-1)
      this.institutionService.getInstitutionsByZone(this.selectedZone).subscribe(data=>{
        this.institutions=data;
      })

  }
  public validate(form: NgForm): void {
    if (form.invalid) {
      for (const control of Object.keys(form.controls)) {
        form.controls[control].markAsTouched();
      }
      return;
    }


  }
  ngOnInit(): void {
    this.contractService.getAllContrats().subscribe(data => {
      this.allContracts = data;
      this.initializeDataTable(data);
    });
  }
  initializeDataTable(data: any[]): void {
    $('#ZonesTable').DataTable().clear();
    $('#ZonesTable tbody').empty();
    var groupColumn = 1; // Index of the column to group by (0-based index)
    var table = $('#ZonesTable').DataTable({
      responsive: true,
      destroy: true,
      lengthChange: false,
      autoWidth: false,
      select: true,
      data: data,
      columns: [
        { data: 'institution.nom' },
        { data: 'institution.zone.nom', className: 'group' }, // Add 'group' class for grouping
        { data: 'sousTraitant.raison_sociale' },
        { data: 'sousTraitant.nom_contact' },
        {
          data: 'date_debut',
          render: function (data: any, type: any, row: any) {
            var datePart = new Date(data).toISOString().split('T')[0];
            return datePart;
          }
        },
        {
          data: 'date_debut',
          render: function (data: any, type: any, row: any) {
            var startDate = new Date(data);
            var duration = row.duree; // Assuming the duration is available in the row data
            // Calculate the expiration date based on the start date and duration
            var expirationDate = new Date(startDate.getFullYear() + duration, startDate.getMonth(), startDate.getDate());
            var currentDate = new Date();


              var datePart = expirationDate.toISOString().split('T')[0];
              return datePart;

          }
        },
        {
          data: null, render: function (data: any, type: any, row: { id: any; deletedAt: any;date_debut:any;duree:any; }) {
            var startDate = new Date(row.date_debut);
            var duration = row.duree;
            var expirationDate = new Date(startDate.getFullYear() + duration, startDate.getMonth(), startDate.getDate());
            var currentDate = new Date();
            if (expirationDate < currentDate) {
              // Contract expired, hide the edit button
              return '';
            } else {
            return `
          <div class="d-flex align-items-center">
            <a class="btn-update btn-outline-primary" data-userid="${row.id}"><i class="fas fa-edit"></i></a>
          </div>
        `;}
          }
        },
        {
          data: null, render: function (data: any, type: any, row: { id: any; deletedAt: any;date_debut:any;duree:any;}) {
            var startDate = new Date(row.date_debut);
            var duration = row.duree;
            var expirationDate = new Date(startDate.getFullYear() + duration, startDate.getMonth(), startDate.getDate());
            var currentDate = new Date();
            if (expirationDate < currentDate) {
              // Contract expired, hide the edit button
              return '';
            } else {
            return `
          <div class="d-flex align-items-center">
            <a class="btn-del mr-3 btn-outline-danger" style="color:#ff5b5b" data-userid="${row.id}"><i class="fas fa-trash"></i></a>
          </div>
        `;}
          }
        }
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
    var showExpired = false;
    var toggleFilterButton = {
      text: function () {
        return showExpired ? 'Current Contracts' : 'All';
      },
      action: function () {
        showExpired = !showExpired;
        table.draw();
        var button = table.buttons()[3].node;
        button.innerHTML = toggleFilterButton.text();
      }
    };
    $.fn.dataTable.ext.buttons.toggleFilterButton = toggleFilterButton;

    new $.fn.dataTable.Buttons(table, {
      buttons: ['copy', 'excel', 'pdf', 'print','toggleFilterButton']
    }).container().appendTo('#ZonesTable_wrapper .col-md-6:eq(0)');

    $.fn.dataTable.ext.search.push(function (settings: any, data: any, dataIndex: any) {
      // If the showExpired flag is true, display all rows
      if (showExpired) {
        return true;
      }

      // Get the expiration date for the current row
      var startDate = new Date(data[4]); // Assuming date_debut is in the 5th column

      var duration = 1;
      var expirationDate = new Date(startDate.getFullYear() + duration, startDate.getMonth() + 1, startDate.getDate());
      var currentDate = new Date();

      // Display the row only if the contract is not expired
      return expirationDate >= currentDate;
    });


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
      //this.onUserDeleteBtnClick(userId, rowIndex);
    });
    table.draw();
  }



  //Update process
  onUserUpdateBtnClick(userId: number, rowIndex: number) {
    this.contractService.getContratByID(userId).subscribe((data) => {
      this.userId = data.id;
      this.zoneName = data["institution"]!["zone"]["nom"];
      this.editFormShow = true;
      this.rowIndex = rowIndex;
    })
  }
  confirmUpdateAction() {
    // const userData: UpdateZoneDto = {
    //   nom: this.zoneName
    // };
    // this.zoneService.updateZone(this.userId,userData).subscribe(
    //   response => {
    //     // Handle the successful update response
    //     this.zoneService.getAllZones().subscribe(data => {
    //       this.allZones = data;
    //       this.initializeDataTable(data);
    //     });
    //     this.zoneName=""
    //     this.editFormShow = false;
    //     this.updateInProgress=false;
    //   },
    //   error => {
    //     // Handle any errors that occurred during the update
    //     console.error('Error updating user:', error);
    //   }
    // );
  }
  cancelUpdateAction(){
    this.editFormShow = false;
    this.updateInProgress=false;
  }

  //Delete process
  onUserDeleteBtnClick(userId: number, rowIndex: number) {
    // this.zoneService.getZoneByID(userId).subscribe(({id, nom}) => {
    //   this.userId = id;
    //   this.zoneName = nom;
    //   this.deleteConfirmationFormShow = true;
    //   this.rowIndex = rowIndex;
    //   this.deleteConfirmationMessage=`Do you really want to permanently delete: ${this.zoneName}`
    //
    // })
  }
  confirmDeleteAction() {
    // this.zoneService.deleteZone(this.userId).subscribe(response => {
    //   this.deleteConfirmationFormShow = false;
    //   this.updateInProgress=false;
    //   this.zoneService.getAllZones().subscribe(data => {
    //     this.allZones = data;
    //     this.initializeDataTable(data);
    //   });
    // })
  }
  cancelDeleteAction() {
    this.deleteConfirmationFormShow = false;
    this.updateInProgress=false;
  }

  //Creation process


  onCreateBtnClick() {
    this.createFormShow=true;
    this.updateInProgress=true;
  }
  confirmCreateAction(form:NgForm) {
    alert(form.invalid)
    try{
    if (form.invalid) {
      for (const control of Object.keys(form.controls)) {
        form.controls[control].markAsTouched();
      }
      return;
    }else {
      const contractData: CreateContratDto = {
        date_debut: this.contractStart,
        duree: 1,
        institutionId: this.selectedInstitution,
        sousTraitantId: this.selectedSubcontractor.id
      }
      const {date_debut, duree, institutionId} = contractData;
      const endDate = new Date(date_debut);
      endDate.setFullYear(endDate.getFullYear() + duree);
      const existingContract = this.allContracts.find((contract) => {
        const contractStartDate = new Date(contract.date_debut);
        const contractEndDate = new Date(
          contractStartDate.getFullYear() + contract.duree,
          contractStartDate.getMonth(),
          contractStartDate.getDate()
        );

        const newContractStartDate = new Date(date_debut);
        const newContractEndDate = new Date(
          newContractStartDate.getFullYear() + duree,
          newContractStartDate.getMonth(),
          newContractStartDate.getDate()
        );
        console.log(contract.institution?.id, institutionId, contractStartDate.toDateString(), contractEndDate.toDateString(), "-", newContractStartDate.toDateString(), newContractEndDate.toDateString())
        return (
          contract.institution?.id === Number(institutionId) &&
          areIntervalsOverlapping(
            {start: contractStartDate, end: contractEndDate},
            {start: newContractStartDate, end: newContractEndDate}
          )
        );
      });

      if (existingContract) {
        // A contract with the same institution already exists within the specified period
        // Display the error message
        this.errorMessage = 'A contract with the same institution already exists within the specified period.';
        return;
      }

      this.contractService.createContrat(contractData).subscribe(
        response => {
          if ('message' in response) {
            // Display the error message
            this.errorMessage = response.message;
          } else {
            // Contrat created successfully
            this.contractService.getAllContrats().subscribe(data => {
              this.allContracts = data;
              this.initializeDataTable(data);
            });
            this.zoneName = "";
            this.createFormShow = false;
            this.updateInProgress = false;
          }
        },
        error => {
          // Handle the error here if necessary
          console.error(error);
          this.errorMessage = 'An error occurred during contract creation.';
        }
      );
    }}catch (error){
      console.log(error)
    }
  }
  cancelCreateAction() {
    this.createFormShow = false;
    this.updateInProgress=false;
  }

  cnt() {

  }

  addYear() {

      const startDate = new Date(this.contractStart);
      const endDate = new Date(startDate.getFullYear() + 1, startDate.getMonth(), startDate.getDate());
    this.contractEnd = endDate.toISOString().slice(0, 10);

  }
}

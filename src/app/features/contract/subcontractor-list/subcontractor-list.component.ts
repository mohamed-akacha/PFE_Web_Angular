import { Component } from '@angular/core';
import {CreateSousTraitantDto, Subcontractor, UpdateSousTraitantDto} from "../../../core/models/Subcontractor";
import {Router} from "@angular/router";
import {SubcontractorService} from "../../../core/services/subcontractor.service";

declare var $: any;
@Component({
  selector: 'app-subcontractor-list',
  templateUrl: './subcontractor-list.component.html',
  styleUrls: ['./subcontractor-list.component.scss']
})
export class SubcontractorListComponent {
  userId: number = 0;
  nomContact: string = "";
  telContact: string = "";
  emailContact: string = "";
  raisonSociale: string = "";
  editFormShow: boolean = false;
  confirmationFormShow: boolean = false;
  confirmationMessage: string = "";
  deleteConfirmationMessage: string = "";
  deleteConfirmationFormShow: boolean = false;
  createFormShow: boolean = false;
  updateInProgress: boolean = false;
  allSubcontractors: Subcontractor[] = [];
  rowIndex: number = -1;
  status: any;

  constructor(
    private subcontractorService: SubcontractorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subcontractorService.getAllSubcontractors().subscribe(data => {
      this.allSubcontractors = data;
      this.initializeDataTable(data);
    });
  }

  initializeDataTable(data: any[]): void {
    $('#SubcontractorsTable').DataTable().clear();
    $('#SubcontractorsTable tbody').empty();
    var table = $('#SubcontractorsTable').DataTable({
      responsive: true,
      destroy: true,
      lengthChange: false,
      autoWidth: false,
      select: true,
      data: data,
      columns: [
        { data: 'nom_contact' },
        { data: 'tel_contact' },
        { data: 'email_contact' },
        { data: 'raison_sociale' },
        {
          data: null,
          render: function (data: any, type: any, row: { id: any; deletedAt: any }) {
            return `
              <div class="d-flex align-items-center">
                <a class="btn-update btn-outline-primary" data-userid="${row.id}"><i class="fas fa-edit"></i></a>
              </div>
            `;
          }
        },
        {
          data: null,
          render: function (data: any, type: any, row: { id: any; deletedAt: any }) {
            return `
              <div class="d-flex align-items-center">
                <a class="btn-del mr-3 btn-outline-danger" style="color:#ff5b5b" data-userid="${row.id}"><i class="fas fa-trash"></i></a>
              </div>
            `;
          }
        }
      ]
    });

    new $.fn.dataTable.Buttons(table, {
      buttons: ['copy', 'excel', 'pdf', 'print']
    }).container().appendTo('#SubcontractorsTable_wrapper .col-md-6:eq(0)');



    $('#SubcontractorsTable').on('click', '.btn-update', (event: { currentTarget: any; preventDefault: () => void }) => {
      event.preventDefault();
      const userId = $(event.currentTarget).data('userid');
      const rowIndex = $(event.currentTarget).closest('tr').index();
      this.updateInProgress = true;
      this.onUserUpdateBtnClick(userId, rowIndex);
    });

    $('#SubcontractorsTable').on('click', '.btn-del', (event: { currentTarget: any; preventDefault: () => void }) => {
      event.preventDefault();
      const userId = $(event.currentTarget).data('userid');
      const rowIndex = $(event.currentTarget).closest('tr').index();
      this.updateInProgress = true;
      this.onUserDeleteBtnClick(userId, rowIndex);
    });
  }

  onUserUpdateBtnClick(userId: number, rowIndex: number) {
    this.subcontractorService.getSubcontractorByID(userId).subscribe(({ id, nom_contact, tel_contact, email_contact, raison_sociale }) => {
      this.userId = id;
      this.nomContact = nom_contact;
      this.telContact = tel_contact;
      this.emailContact = email_contact;
      this.raisonSociale = raison_sociale;
      this.editFormShow = true;
      this.rowIndex = rowIndex;
    })
  }
  confirmUpdateAction() {
    const userData: UpdateSousTraitantDto = {
      nom_contact: this.nomContact,
      tel_contact: this.telContact,
      email_contact: this.emailContact,
      raison_sociale: this.raisonSociale
    };
    this.subcontractorService.updateSubcontractor(this.userId, userData).subscribe(
      response => {
        this.subcontractorService.getAllSubcontractors().subscribe(data => {
          this.allSubcontractors = data;
          this.initializeDataTable(data);
        });
        this.editFormShow = false;
        this.updateInProgress = false;
      },
      error => {
        console.error('Error updating subcontractor:', error);
      }
    );
  }
  cancelUpdateAction() {
    this.editFormShow = false;
    this.updateInProgress = false;
  }

  onUserDeleteBtnClick(userId: number, rowIndex: number) {
    this.subcontractorService.getSubcontractorByID(userId).subscribe(data => {
      this.userId = data.id;
      this.nomContact = data.nom_contact;
      this.raisonSociale=data.raison_sociale;
      this.deleteConfirmationFormShow = true;
      this.rowIndex = rowIndex;
      this.deleteConfirmationMessage = `Do you really want to permanently delete : ${this.raisonSociale}`;
    })
  }
  confirmDeleteAction() {
    this.subcontractorService.deleteSubcontractor(this.userId).subscribe(response => {
      this.deleteConfirmationFormShow = false;
      this.updateInProgress = false;
      this.subcontractorService.getAllSubcontractors().subscribe(data => {
        this.allSubcontractors = data;
        this.initializeDataTable(data);
      });
    })
  }
  cancelDeleteAction() {
    this.deleteConfirmationFormShow = false;
    this.updateInProgress = false;
  }

  onUserCreateBtnClick() {
    this.createFormShow = true;
    this.updateInProgress = true;
  }
  confirmCreateAction() {
    const userData: CreateSousTraitantDto = {
      nom_contact: this.nomContact,
      tel_contact: this.telContact,
      email_contact: this.emailContact,
      raison_sociale: this.raisonSociale
    };
    this.subcontractorService.createSubcontractor(userData).subscribe(response => {
      this.subcontractorService.getAllSubcontractors().subscribe(data => {
        this.allSubcontractors = data;
        this.initializeDataTable(data);
      });
      this.nomContact = "";
      this.telContact = "";
      this.emailContact = "";
      this.raisonSociale = "";
      this.createFormShow = false;
      this.updateInProgress = false;
    });
  }
  cancelCreateAction() {
    this.createFormShow = false;
    this.updateInProgress = false;
  }

}

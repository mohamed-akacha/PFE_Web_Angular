import {Component, OnInit} from '@angular/core';
import {UsersService} from "../../../core/services/users.service";
import {Router} from "@angular/router";
import {UpdateUserDto, User, UserRoleEnum} from "../../../core/models/User";


declare var $: any;
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  //info user
  userId: number=0;
  fullname:string="";
  email:string="";
  role:string="";
  phone:string="";
  deletedAt: Date | null=null;
  //modals vars
  editFormShow:boolean=false;
  confirmationFormShow: boolean=false;
  confirmationMessage: string="";
  deleteConfirmationMessage: string="";
  deleteConfirmationFormShow: boolean=false;
  createFormShow: boolean=false;
  updateInProgress: boolean=false;
  //Datatable HTML update
  rowIndex: number=-1;
  status: any;
  allUsers:User[]=[];


  constructor(private userService: UsersService,private router: Router,) {}
  ngOnInit() {
    this.userService.getAllUsers('all', 'all').subscribe(data => {
      this.allUsers=data;
      this.initializeDataTable(this.allUsers)
    });
  }

  initializeDataTable(data: any[]): void {
    var table = $('#UsersTable').DataTable({
      responsive: true,
      destroy:true,
      lengthChange: false,
      autoWidth: false,
      select: true,
      data: data,
      columns: [
        {data: 'username'},
        {data: 'email'},
        {data: 'tel'},
        {data:'role',render: function (data:string){
          if (data === 'admin') {
            return '<span class="status" style="color:#123456"><i class="fas fa-user-shield"></i> Administrator</span>';
          } else {
                return '<span class="status" style="color:#123456"><i class="fas fa-user"></i> Inspector</span>';
          }
        }},
        {data: null, render: function (data: any, type: any, row: { id: any; deletedAt: any;username:string }) {
            var retour=""
          if (row.deletedAt === null && row.username!=="" && row.username!==null) {
              retour= '<span class="status" style="color:#10c469">&#x25cf;Active</span> ';
            }
            if(row.deletedAt !==null) {
              retour= '<span class="status" style="color:#ff5b5b">&#x25cf;Inactive</span> ';
            }
            if(row.username==="" || row.username===null){
              retour= '<span class="status" style="color:#0056b3">&#x25cf;Unconfirmed account</span> ';
            }
            return retour
        }},
        { data: null, render: function (data: any, type: any, row: { id: any; deletedAt: any; username:string }) {
            if(row.username!=="" && row.username!==null){
            return `
              <div class="d-flex align-items-center">
                <a class="btn-update btn-outline-primary"  data-userid="${row.id}"><i class="fas fa-edit"></i></a>
              </div>
            `;}else return "";
        }},
        {data: null, render: function (data: any, type: any, row: { id: any; deletedAt: any;username:string  }) {
            if(row.username==="" || row.username===null){
          return "";
            }
            else{
              return `
                  <div class="d-flex align-items-center">
                      <a href="#" class="btn-disable mr-3 btn-outline-secondary"  data-status="${row.deletedAt}" data-userid="${row.id}"><i class="fa ${row.deletedAt===null ? 'fa-ban' : 'fa-check'}"></i></a>
                  </div>`
            }
        }},
        { data: null, render: function (data: any, type: any, row: { id: any; deletedAt: any; }) {
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
    }).container().appendTo('#UsersTable_wrapper .col-md-6:eq(0)');

    $('#UsersTable').on('click', '.btn-update', (event: { currentTarget: any; preventDefault: () => void; }) => {
      event.preventDefault();
      const userId = $(event.currentTarget).data('userid');
      const rowIndex = $(event.currentTarget).closest('tr').index();
      this.updateInProgress=true;
      this.onUserUpdateBtnClick(userId,rowIndex);
    });
    $('#UsersTable').on('click', '.btn-disable', (event: { currentTarget: any; preventDefault: () => void; }) => {
      event.preventDefault();
      const userId = $(event.currentTarget).data('userid');
      const status= $(event.currentTarget).data('status')
      const rowIndex = $(event.currentTarget).closest('tr').index();
      this.updateInProgress=true;
      this.onUserActivateBtnClick(userId,rowIndex,status);
    });
    $('#UsersTable').on('click', '.btn-del', (event: { currentTarget: any; preventDefault: () => void; }) => {
      event.preventDefault();
      const userId = $(event.currentTarget).data('userid');
      const rowIndex = $(event.currentTarget).closest('tr').index();
      this.updateInProgress=true;
      this.onUserDeleteBtnClick(userId,rowIndex);
    });
  }

  //Update process
  onUserUpdateBtnClick(userId: number, rowIndex: number) {
    this.userService.getUserById(userId).subscribe(({id, username, email, role, tel, deletedAt}) => {
      this.userId = id;
      this.fullname = username;
      this.email = email;
      this.role = role;
      this.phone = tel;
      this.editFormShow = true;
      this.deletedAt=deletedAt;
      this.rowIndex = rowIndex;
    })
  }
  confirmUpdateAction() {
    const userData: UpdateUserDto = {
      username: this.fullname,
      email: this.email,
      tel: this.phone,
      deletedAt:this.deletedAt,
      role: this.role as UserRoleEnum
    };
    this.userService.updateUser(this.userId,userData).subscribe(response => {
      this.userService.getAllUsers('all', 'all').subscribe(data => {
        this.allUsers=data;
        this.initializeDataTable(this.allUsers)
      });
      this.fullname =""
      this.email=""
      this.phone=""
      this.editFormShow = false;
      this.updateInProgress=false;
    },error => {
        console.error('Error updating user:', error);
    }
    );
  }
  cancelUpdateAction(){
    this.editFormShow = false;
    this.updateInProgress=false;
  }

  //Enable-Disable process
  onUserActivateBtnClick(userId: number, rowIndex: number,userStatus:any) {
    this.userService.getUserById(userId).subscribe(({id, username, email, role, tel, deletedAt}) => {
      this.userId = id;
      this.fullname = username;
      this.email = email;
      this.role = role;
      this.phone = tel;
      this.confirmationFormShow = true;
      this.rowIndex = rowIndex;
      this.status=userStatus;
      if(userStatus===null){this.confirmationMessage=`Do you really want to disable: ${this.fullname}`}
      else{this.confirmationMessage=`Do you really want to enable: ${this.fullname}`}
    })
  }
  confirmActivateAction() {
    if(this.status===null){
      this.userService.softDeleteUser(this.userId).subscribe(response => {
        this.confirmationFormShow = false;
        this.updateInProgress=false;
        this.userService.getAllUsers('all', 'all').subscribe(data => {
          this.allUsers=data;
          this.initializeDataTable(this.allUsers)
        });
      })
    }else{
      this.userService.restoreUser(this.userId).subscribe(response => {
        this.userService.getAllUsers('all', 'all').subscribe(data => {
          this.allUsers=data;
          this.initializeDataTable(this.allUsers)
        });
        this.confirmationFormShow = false;
        this.updateInProgress=false;
      })
    }


  }
  cancelActivateAction() {
    this.confirmationFormShow = false;
    this.updateInProgress=false;
  }

  //Delete process
  onUserDeleteBtnClick(userId: number, rowIndex: number) {
    this.userService.getUserById(userId).subscribe(({id, username, email, role, tel, deletedAt}) => {
      this.userId = id;
      this.fullname = username;
      this.email = email;
      this.role = role;
      this.phone = tel;
      this.deleteConfirmationFormShow = true;
      this.rowIndex = rowIndex;
      this.deleteConfirmationMessage=`Do you really want to permanently delete: ${this.fullname}`

    })
  }
  confirmDeleteAction() {
    this.userService.deleteUser(this.userId).subscribe(response => {
      this.deleteConfirmationFormShow = false;
      this.updateInProgress=false;
      this.userService.getAllUsers('all', 'all').subscribe(data => {
        this.allUsers=data;
        this.initializeDataTable(this.allUsers)
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
    const userData={email:this.email,role:this.role}
    this.userService.createUser(userData).subscribe(response => {
      this.userService.getAllUsers('all', 'all').subscribe(data => {
        this.allUsers=data;
        this.initializeDataTable(this.allUsers)
      });
      this.createFormShow=false;
      this.updateInProgress=false;
    });
  }
  cancelCreateAction() {
    this.createFormShow = false;
    this.updateInProgress=false;
  }

}

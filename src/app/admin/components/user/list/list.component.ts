import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { List_Order } from 'src/app/contracts/order/list_order';
import { List_User } from 'src/app/contracts/users/list_user';
import { AuthorizeUserDialogComponent } from 'src/app/dialogs/authorize-user-dialog/authorize-user-dialog.component';
import { OrderDetailDialogComponent } from 'src/app/dialogs/order-detail-dialog/order-detail-dialog.component';
import { AlertifyService, MessageType } from 'src/app/services/admin/alertify.service';
import { DialogService } from 'src/app/services/common/dialog.service';
import { OrderService } from 'src/app/services/common/models/order.service';
import { UserService } from 'src/app/services/common/models/user.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent extends BaseComponent implements OnInit {
  constructor(spinner: NgxSpinnerService, private userService: UserService,
    private alertify: AlertifyService, private dialogService: DialogService) {
    super(spinner);
  }
  displayedColumns: string[] = ["userName", "email", "nameSurname", "assignRole", "delete"];
  dataSource: MatTableDataSource<List_User> = null;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  async ngOnInit() {
    this.getUsers();
  }

  async getUsers() {
    this.showSpinner(SpinnerType.BallSpinClockwiseFadeRotating);

    const allUsers: { totalCount: number, users: List_User[] } = await this.userService.getAllUsers(
      this.paginator ? this.paginator.pageIndex : 0,
      this.paginator ? this.paginator.pageSize : 13,
      () => {
        this.hideSpinner(SpinnerType.BallSpinClockwiseFadeRotating)
      },
      () => {
        this.alertify.message("Error occured while getting users!", { messageType: MessageType.Error });
        this.hideSpinner(SpinnerType.BallSpinClockwiseFadeRotating);
      });

    this.dataSource = new MatTableDataSource<List_User>(allUsers.users);
    this.paginator.length = allUsers.totalCount;
  }

  async pageChanged() {
    await this.getUsers();
  }

  assignRole(id: string){
    this.dialogService.openDialog({
      componentType: AuthorizeUserDialogComponent,
      data: id,
      options: {
        width: "1000px"
      }
    })
  }

}

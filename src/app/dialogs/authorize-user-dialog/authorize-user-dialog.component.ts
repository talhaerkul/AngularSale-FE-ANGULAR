import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { BaseDialog } from '../base/base-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RoleService } from 'src/app/services/common/models/role.service';
import { AuthorizationEndpointService } from 'src/app/services/common/models/authorization-endpoint.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertifyService } from 'src/app/services/admin/alertify.service';
import { SpinnerType } from 'src/app/base/base.component';
import { MatSelectionList } from '@angular/material/list';
import { List_Role } from 'src/app/contracts/role/list_role';
import { UserService } from 'src/app/services/common/models/user.service';

@Component({
  selector: 'app-authorize-user-dialog',
  templateUrl: './authorize-user-dialog.component.html',
  styleUrls: ['./authorize-user-dialog.component.scss']
})
export class AuthorizeUserDialogComponent extends BaseDialog<AuthorizeUserDialogComponent> implements OnInit {

  constructor(
    dialogRef: MatDialogRef<AuthorizeUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private roleService: RoleService,
    private userService: UserService, private spinner: NgxSpinnerService,
    private alertify: AlertifyService
  ) {
    super(dialogRef);
  }
  async ngOnInit() {
    this.spinner.show(SpinnerType.BallSpinClockwiseFadeRotating);
    this.roles = await this.roleService.getRoles(-1, -1, async () => {
      this.assignedRoles = await this.userService.getRolesToUser(this.data as string, () => { });
      this.spinner.hide(SpinnerType.BallSpinClockwiseFadeRotating);
    });
  }

  roles: { datas: List_Role[], totalCount: number };
  assignedRoles: string[];

  @ViewChild(MatSelectionList) roleSelectList: MatSelectionList

  Assign() {
    this.spinner.show(SpinnerType.BallSpinClockwiseFadeRotating);
    let selectedRoles: string[] = this.roleSelectList.selectedOptions.selected.map(r => r.value.name);
    this.userService.assignRoleUser(selectedRoles, this.data as string,
      () => { this.spinner.hide(SpinnerType.BallSpinClockwiseFadeRotating); });
  }

  isExist(name: string): boolean {
    if(this.assignedRoles != null){
      for (const role of Object.keys(this.assignedRoles)) {
        const _assignedRoles = this.assignedRoles[role];
        for(let _role of _assignedRoles)
          if (_role == name)
            return true;
      }
    }
    return false;
  }
}

export enum AuthorizeMenuState {
  Yes,
  No
}

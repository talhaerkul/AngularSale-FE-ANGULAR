import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { BaseDialog } from '../base/base-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RoleService } from 'src/app/services/common/models/role.service';
import { List_Role } from 'src/app/contracts/role/list_role';
import { MatSelectionList } from '@angular/material/list';
import { AuthorizationEndpointService } from 'src/app/services/common/models/authorization-endpoint.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from 'src/app/base/base.component';
import { AlertifyService, MessageType } from 'src/app/services/admin/alertify.service';

@Component({
  selector: 'app-authorize-menu-dialog',
  templateUrl: './authorize-menu-dialog.component.html',
  styleUrls: ['./authorize-menu-dialog.component.scss']
})


export class AuthorizeMenuDialogComponent extends BaseDialog<AuthorizeMenuDialogComponent> implements OnInit {

  constructor(
    dialogRef: MatDialogRef<AuthorizeMenuDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private roleService: RoleService,
    private authorizationEndpointService: AuthorizationEndpointService, private spinner: NgxSpinnerService,
    private alertify: AlertifyService
  ) {
    super(dialogRef);
  }
  async ngOnInit() {
    this.spinner.show(SpinnerType.BallSpinClockwiseFadeRotating);
    this.roles = await this.roleService.getRoles(-1, -1, async () => {
      this.assignedRoles = await this.authorizationEndpointService.getRolesToEndpoint(this.data.code, this.data.menu, () => { });
      this.spinner.hide(SpinnerType.BallSpinClockwiseFadeRotating);
    });
  }

  roles: { datas: List_Role[], totalCount: number };
  assignedRoles: string[];

  @ViewChild(MatSelectionList) roleSelectList: MatSelectionList

  Assign() {
    this.spinner.show(SpinnerType.BallSpinClockwiseFadeRotating);
    let selectedRoles: string[] = this.roleSelectList.selectedOptions.selected.map(r => r.value.name);
    this.authorizationEndpointService.assignRoleEndpoint(selectedRoles, this.data.code as string, this.data.menu as string,
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


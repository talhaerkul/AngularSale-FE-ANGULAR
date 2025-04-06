import { Component, ViewChild } from '@angular/core';
import { ListComponent } from './list/list.component';
import { Create_Role } from 'src/app/contracts/role/create_role';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent {


  @ViewChild(ListComponent) listComponent: ListComponent
  createdRole(roleInEvent: Create_Role) {
    this.listComponent.getRoles();
  }
}

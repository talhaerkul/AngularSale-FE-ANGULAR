import { Component, EventEmitter, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { Create_Role } from 'src/app/contracts/role/create_role';
import { AlertifyService, MessageType, Position } from 'src/app/services/admin/alertify.service';
import { RoleService } from 'src/app/services/common/models/role.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent extends BaseComponent {

  constructor(spinner: NgxSpinnerService, private roleService: RoleService, private alertify: AlertifyService) {
    super(spinner);
  }
  @Output() createdRole : EventEmitter<Create_Role> = new EventEmitter();

  create(name: HTMLInputElement) {
    this.showSpinner(SpinnerType.BallSpinClockwiseFadeRotating);
    this.roleService.create(name.value,
      // success kısmı
      () => {
        this.hideSpinner(SpinnerType.BallSpinClockwiseFadeRotating);
        this.alertify.message("Role Created", { messageType: MessageType.Success, delay: 1 });
        //haberleşme için oluşturduğumuz ürünü emit ediyoruz
        this.createdRole.emit(Create_Role);
      }
    );
  }
}

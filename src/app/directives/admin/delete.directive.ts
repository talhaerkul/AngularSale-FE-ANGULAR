import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2 } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from 'src/app/base/base.component';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent, DeleteState } from 'src/app/dialogs/delete-dialog/delete-dialog.component';
import { HttpClientService } from 'src/app/services/common/http-client.service';
import { AlertifyService, MessageType, Position } from 'src/app/services/admin/alertify.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogService } from 'src/app/services/common/dialog.service';

declare var $: any;

@Directive({
  selector: '[appDelete]'
})
export class DeleteDirective {

  constructor(private element: ElementRef, private _renderer: Renderer2,
    private httpClient: HttpClientService, private spinner: NgxSpinnerService,
    public dialog: MatDialog, private alertify: AlertifyService,
    private dialogService: DialogService) {
    const img = this._renderer.createElement("img");
    img.setAttribute("src", "../../../../../assets/img/delete.png");
    img.setAttribute("style", "cursor: pointer;");
    img.width = 25;
    img.height = 25;
    _renderer.appendChild(element.nativeElement, img);
  }

  @Input() id: string;
  @Input() controller: string;
  @Output() refresh: EventEmitter<any> = new EventEmitter();

  @HostListener("click")
  async onclick() {
    this.dialogService.openDialog({
      componentType: DeleteDialogComponent,
      data: DeleteState.Yes,
      afterClosed: async () => {
      this.spinner.show(SpinnerType.BallSpinClockwiseFadeRotating);
      const td: HTMLTableCellElement = this.element.nativeElement;
      await this.httpClient.delete({ controller: this.controller }, this.id).subscribe(data => {
        $(td.parentElement).animate({ opacity: 0, left: "+=50", height: "toggle" }, 400, () => {
          this.refresh.emit();
          this.alertify.message("Data has been deleted!", { messageType: MessageType.Warning, position: Position.TopRight, delay: 1 });
        });
        this.spinner.hide(SpinnerType.BallSpinClockwiseFadeRotating);
      },
        (errorResponse: HttpErrorResponse) => {
          this.spinner.hide(SpinnerType.BallSpinClockwiseFadeRotating);
          this.alertify.message("Error occurred while deleting data!", { messageType: MessageType.Error, position: Position.TopRight, delay: 1 });
        });
    }});

  }


}

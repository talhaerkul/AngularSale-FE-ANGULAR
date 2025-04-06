import { Component, Input } from '@angular/core';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { HttpClientService } from '../http-client.service';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AlertifyService, MessageType, Position } from '../../admin/alertify.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../ui/custom-toastr.service';
import { MatDialog } from '@angular/material/dialog';
import { UploadState, FileUploadDialogComponent } from 'src/app/dialogs/file-upload-dialog/file-upload-dialog.component';
import { DialogService } from '../dialog.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from 'src/app/base/base.component';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {

  constructor(
    private httpClient: HttpClientService, private alertify: AlertifyService,
    private toastr: CustomToastrService, private dialog: MatDialog, private dialogService: DialogService,
    private spinner: NgxSpinnerService
  ) { }

  public files: NgxFileDropEntry[];

  @Input() options: Partial<FileUploadOptions>;

  public selectedFiles(files: NgxFileDropEntry[]) {
    this.dialogService.openDialog({
      componentType: FileUploadDialogComponent,
      data: UploadState.Yes,
      afterClosed: () => {
        this.files = files;
        const fileData: FormData = new FormData();
        for (const file of files) {
          (file.fileEntry as FileSystemFileEntry).file((_file: File) => { fileData.append(_file.name, _file, file.relativePath) });
        }
        this.spinner.show(SpinnerType.BallScaleMultiple);
        this.httpClient.post({
          controller: this.options.controller,
          action: this.options.action,
          queryString: this.options.queryString,
          headers: new HttpHeaders({ "responseType": "blob" })
        }, fileData).subscribe(data => {
          this.spinner.hide(SpinnerType.BallScaleMultiple);
          const message = "Files Uploaded!";
          if (this.options.isAdminPage)
            this.alertify.message(message, { position: Position.TopRight, messageType: MessageType.Success });
          else
            this.toastr.message(message, "", { position: ToastrPosition.TopRight, messageType: ToastrMessageType.Success });

        }, (errorResponse: HttpErrorResponse) => {
          this.spinner.hide(SpinnerType.BallScaleMultiple);
          const message = "Error occurred while uploading files!";
          if (this.options.isAdminPage)
            this.alertify.message(message, { position: Position.TopRight, messageType: MessageType.Error });
          else
            this.toastr.message(message, "", { position: ToastrPosition.TopRight, messageType: ToastrMessageType.Error });
        });
      }
    });
  }
}

export class FileUploadOptions {
  controller?: string;
  action?: string;
  queryString?: string;
  explanation?: string;
  accept?: string;
  isAdminPage?: boolean = false;
}

import { Component, Inject, OnInit } from '@angular/core';
import { BaseDialog } from '../base/base-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OrderService } from 'src/app/services/common/models/order.service';
import { Single_Order } from 'src/app/contracts/order/single_order';
import { DatePipe } from '@angular/common';
import { DialogService } from 'src/app/services/common/dialog.service';
import { CompleteOrderDialogComponent, CompleteOrderState } from '../complete-order-dialog/complete-order-dialog.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from 'src/app/base/base.component';
import { AlertifyService, MessageType, Position } from 'src/app/services/admin/alertify.service';


@Component({
  selector: 'app-order-detail-dialog',
  templateUrl: './order-detail-dialog.component.html',
  styleUrls: ['./order-detail-dialog.component.scss']
})
export class OrderDetailDialogComponent extends BaseDialog<OrderDetailDialogComponent> implements OnInit {

  constructor(
    dialogRef: MatDialogRef<OrderDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DetailState | string,
    private orderService: OrderService, private dialogService: DialogService, private spinner: NgxSpinnerService,
    private alertify: AlertifyService
  ) {
    super(dialogRef);
  }

  singleOrder: Single_Order;
  totalPrice: number;
  purchaseDate: string;

  displayedColumns: string[] = ['name', 'price', 'quantity', 'totalPrice'];
  dataSource = [];
  clickedRows = new Set<any>();

  async ngOnInit() {
    this.singleOrder = await this.orderService.getOrderById(this.data as string);
    this.dataSource = this.singleOrder.basketItems;

    const datepipe: DatePipe = new DatePipe('en-US')
    this.purchaseDate = datepipe.transform(this.singleOrder.createdDate, 'dd-MMM-YYYY HH:mm:ss')

    this.totalPrice = this.singleOrder.basketItems
      .map((basketItem, index) => basketItem.price * basketItem.quantity)
      .reduce((price, current) => price + current);

  }

  completeOrder() {
    this.dialogService.openDialog({
      componentType: CompleteOrderDialogComponent,
      data: CompleteOrderState.Yes,
      afterClosed: async () => {
        this.spinner.show(SpinnerType.BallSpinClockwiseFadeRotating);
        await this.orderService.completeOrder(this.data as string, () => {
          this.spinner.hide(SpinnerType.BallSpinClockwiseFadeRotating);
          this.alertify.message("Order completed!",{messageType: MessageType.Success, position: Position.TopRight});
        });
      }
    });
  }
}



export enum DetailState {
  Complete,
  Cancel
}

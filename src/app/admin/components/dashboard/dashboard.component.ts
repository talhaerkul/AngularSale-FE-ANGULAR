import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { HubUrls } from 'src/app/constants/hub-urls';
import { ReceiveFunctions } from 'src/app/constants/receive-functions';
import { AlertifyService, MessageType, Position } from 'src/app/services/admin/alertify.service';
import { SignalRService } from 'src/app/services/common/signalr.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends BaseComponent implements OnInit {

  constructor(spinner: NgxSpinnerService, private signalR: SignalRService, private alerttify: AlertifyService) {
    super(spinner);
  }

  ngOnInit(): void {
    this.showSpinnerWithTime(SpinnerType.BallAtom);
    this.signalR.on(HubUrls.ProductHub, ReceiveFunctions.receiveProductAddedMessageReceiveFunction, message => {
      this.alerttify.message(message,{position: Position.TopRight,messageType: MessageType.Notify});
    });
    this.signalR.on(HubUrls.OrderHub, ReceiveFunctions.receiveOrderAddedMessageReceiveFunction, message => {
      this.alerttify.message(message,{position: Position.TopRight,messageType: MessageType.Notify});
    });
  }

}

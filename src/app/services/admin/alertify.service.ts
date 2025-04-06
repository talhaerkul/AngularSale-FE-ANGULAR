import { Injectable, OnInit } from '@angular/core';
declare var alertify: any;

@Injectable({
  providedIn: 'root'
})
export class AlertifyService {

  constructor() { }

  message(message: string, options: Partial<AlertifyOptions>) {
    alertify.set("notifier", "delay", options.delay);
    alertify.set("notifier", "position", options.position);
    const msg = alertify[options.messageType](message);
    if (options.dismissOthers)
      msg.dismissOthers();
  }

  dismissAll() {
    alertify.dismissAll();
  }

  dismissOthers() {
    alertify.dismissOthers();
  }

}

export class AlertifyOptions {
  messageType: MessageType = MessageType.Notify;
  position: Position = Position.TopRight;
  delay: number = 3;
  dismissOthers: boolean = true;
}

export enum MessageType {
  Error = "error",
  Message = "message",
  Notify = "notify",
  Success = "success",
  Warning = "warning"
}

export enum Position {
  TopCenter = "top-center",
  TopRight = "top-right",
  TopLeft = "top-left",
  BottomRight = "bottom-right",
  BottomCenter = "bottom-center",
  BottomLeft = "bottom-left"
}


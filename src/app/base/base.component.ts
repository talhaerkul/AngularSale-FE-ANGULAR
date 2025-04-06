import { NgxSpinnerService } from "ngx-spinner";

export class BaseComponent {
  constructor(private spinner: NgxSpinnerService) { }

  showSpinnerWithTime(spinnerNameType: SpinnerType,time: number = 500) {
    this.spinner.show(spinnerNameType);
    setTimeout(() => this.hideSpinner(spinnerNameType), time);
  }
  showSpinner(spinnerNameType: SpinnerType) {
    this.spinner.show(spinnerNameType);
  }

  hideSpinner(spinnerNameType: SpinnerType) {
    this.spinner.hide(spinnerNameType);
  }
}

export enum SpinnerType {
  BallAtom = "s1",
  BallScaleMultiple = "s2",
  BallSpinClockwiseFadeRotating = "s3"
}

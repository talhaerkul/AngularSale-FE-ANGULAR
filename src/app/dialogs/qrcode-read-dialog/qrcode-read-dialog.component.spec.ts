import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrcodeReadDialogComponent } from './qrcode-read-dialog.component';

describe('QrcodeReadDialogComponent', () => {
  let component: QrcodeReadDialogComponent;
  let fixture: ComponentFixture<QrcodeReadDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QrcodeReadDialogComponent]
    });
    fixture = TestBed.createComponent(QrcodeReadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

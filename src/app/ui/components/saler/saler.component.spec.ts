import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalerComponent } from './saler.component';

describe('SalerComponent', () => {
  let component: SalerComponent;
  let fixture: ComponentFixture<SalerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalerComponent]
    });
    fixture = TestBed.createComponent(SalerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

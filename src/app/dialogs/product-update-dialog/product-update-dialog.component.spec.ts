import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductUpdateDialogComponent } from './product-update-dialog.component';

describe('ProductUpdateDialogComponent', () => {
  let component: ProductUpdateDialogComponent;
  let fixture: ComponentFixture<ProductUpdateDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductUpdateDialogComponent]
    });
    fixture = TestBed.createComponent(ProductUpdateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

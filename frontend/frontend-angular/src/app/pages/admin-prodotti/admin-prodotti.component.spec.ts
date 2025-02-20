import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProdottiComponent } from './admin-prodotti.component';

describe('AdminProdottiComponent', () => {
  let component: AdminProdottiComponent;
  let fixture: ComponentFixture<AdminProdottiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminProdottiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminProdottiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

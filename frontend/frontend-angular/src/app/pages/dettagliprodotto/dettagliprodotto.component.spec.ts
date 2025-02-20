import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DettagliprodottoComponent } from './dettagliprodotto.component';

describe('DettagliprodottoComponent', () => {
  let component: DettagliprodottoComponent;
  let fixture: ComponentFixture<DettagliprodottoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DettagliprodottoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DettagliprodottoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

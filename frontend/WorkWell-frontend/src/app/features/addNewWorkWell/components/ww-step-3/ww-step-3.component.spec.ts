import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WwStep3Component } from './ww-step-3.component';

describe('Step3Component', () => {
  let component: WwStep3Component;
  let fixture: ComponentFixture<WwStep3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WwStep3Component],
    }).compileComponents();

    fixture = TestBed.createComponent(WwStep3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

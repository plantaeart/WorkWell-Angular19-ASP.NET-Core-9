import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WwStep4Component } from './ww-step-4.component';

describe('WwStep4Component', () => {
  let component: WwStep4Component;
  let fixture: ComponentFixture<WwStep4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WwStep4Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WwStep4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

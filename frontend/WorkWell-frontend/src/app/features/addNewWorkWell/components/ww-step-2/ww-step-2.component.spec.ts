import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WwStep2Component } from './ww-step-2.component';

describe('WwStep2Component', () => {
  let component: WwStep2Component;
  let fixture: ComponentFixture<WwStep2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WwStep2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WwStep2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

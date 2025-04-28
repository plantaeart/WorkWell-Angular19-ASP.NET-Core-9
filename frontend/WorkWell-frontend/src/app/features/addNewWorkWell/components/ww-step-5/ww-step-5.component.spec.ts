import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WwStep5Component } from './ww-step-5.component';

describe('WwStep5Component', () => {
  let component: WwStep5Component;
  let fixture: ComponentFixture<WwStep5Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WwStep5Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WwStep5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

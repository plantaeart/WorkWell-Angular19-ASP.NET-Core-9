import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WwStep1Component } from './ww-step-1.component';

describe('WwStep1Component', () => {
  let component: WwStep1Component;
  let fixture: ComponentFixture<WwStep1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WwStep1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WwStep1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

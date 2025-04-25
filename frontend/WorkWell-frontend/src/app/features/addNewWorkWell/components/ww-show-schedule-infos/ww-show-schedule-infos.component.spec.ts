import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WwShowScheduleInfosComponent } from './ww-show-schedule-infos.component';

describe('WwShowScheduleInfosComponent', () => {
  let component: WwShowScheduleInfosComponent;
  let fixture: ComponentFixture<WwShowScheduleInfosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WwShowScheduleInfosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WwShowScheduleInfosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

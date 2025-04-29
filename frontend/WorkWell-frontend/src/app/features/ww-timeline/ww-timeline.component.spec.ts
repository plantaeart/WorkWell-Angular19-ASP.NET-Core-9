import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WwTimelineComponent } from './ww-timeline.component';

describe('WwTimelineComponent', () => {
  let component: WwTimelineComponent;
  let fixture: ComponentFixture<WwTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WwTimelineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WwTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

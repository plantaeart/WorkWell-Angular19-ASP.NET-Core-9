import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WwAddNewWorkWellComponent } from './ww-add-new-work-well.component';

describe('WwAddNewWorkWellComponent', () => {
  let component: WwAddNewWorkWellComponent;
  let fixture: ComponentFixture<WwAddNewWorkWellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WwAddNewWorkWellComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WwAddNewWorkWellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

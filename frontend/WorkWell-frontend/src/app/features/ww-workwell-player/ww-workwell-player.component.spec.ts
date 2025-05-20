import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WwWorkwellPlayerComponent } from './ww-workwell-player.component';

describe('WwWorkwellPlayerComponent', () => {
  let component: WwWorkwellPlayerComponent;
  let fixture: ComponentFixture<WwWorkwellPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WwWorkwellPlayerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WwWorkwellPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

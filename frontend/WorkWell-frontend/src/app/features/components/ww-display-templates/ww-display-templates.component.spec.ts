import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WwDisplayTemplatesComponent } from './ww-display-templates.component';

describe('WwDisplayTemplatesComponent', () => {
  let component: WwDisplayTemplatesComponent;
  let fixture: ComponentFixture<WwDisplayTemplatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WwDisplayTemplatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WwDisplayTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WwHeaderComponent } from './ww-header.component';

describe('HeaderComponent', () => {
  let component: WwHeaderComponent;
  let fixture: ComponentFixture<WwHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WwHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WwHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

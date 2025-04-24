import { Component } from '@angular/core';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'ww-add-new-work-well',
  imports: [StepperModule, ButtonModule],
  templateUrl: './ww-add-new-work-well.component.html',
  styleUrl: './ww-add-new-work-well.component.scss',
})
export class WwAddNewWorkWellComponent {}

import { Component } from '@angular/core';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { WwStep1Component } from '../components/ww-step-1/ww-step-1.component';
import { WwStep2Component } from '../components/ww-step-2/ww-step-2.component';
import { SeparatorComponent } from '../../components/separator/separator.component';
import { WwStep3Component } from '../components/ww-step-3/ww-step-3.component';

@Component({
  selector: 'ww-add-new-work-well',
  imports: [
    StepperModule,
    ButtonModule,
    WwStep1Component,
    WwStep2Component,
    SeparatorComponent,
    WwStep3Component,
  ],
  templateUrl: './ww-add-new-work-well.component.html',
  styleUrl: './ww-add-new-work-well.component.scss',
})
export class WwAddNewWorkWellComponent {
  public meetingCoherencyOk = false;
  public hasMeetings = false;

  onMeetingStateChange(state: {
    isCoherent: boolean;
    hasMeetings: boolean;
  }): void {
    this.meetingCoherencyOk = state.isCoherent;
    this.hasMeetings = state.hasMeetings;
  }
}

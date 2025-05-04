import { Component, inject } from '@angular/core';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { WwStep1Component } from '../components/ww-step-1/ww-step-1.component';
import { WwStep2Component } from '../components/ww-step-2/ww-step-2.component';
import { SeparatorComponent } from '../../components/separator/separator.component';
import { WwStep3Component } from '../components/ww-step-3/ww-step-3.component';
import { WwStep4Component } from '../components/ww-step-4/ww-step-4.component';
import { WwStep5Component } from '../components/ww-step-5/ww-step-5.component';
import { WorkWellStore } from '../../../store/workWell.store';

@Component({
  selector: 'ww-add-new-work-well',
  imports: [
    StepperModule,
    ButtonModule,
    WwStep1Component,
    WwStep2Component,
    SeparatorComponent,
    WwStep3Component,
    WwStep4Component,
    WwStep5Component,
  ],
  templateUrl: './ww-add-new-work-well.component.html',
  styleUrl: './ww-add-new-work-well.component.scss',
})
export class WwAddNewWorkWellComponent {
  public meetingCoherencyOk = true;
  private workWellStore = inject(WorkWellStore);

  onMeetingStateChange(state: { isCoherent: boolean }): void {
    this.meetingCoherencyOk = state.isCoherent;
  }

  public pauseCoherencyOk = false;
  public hasPauses = false;

  onPauseStateChange(state: { isCoherent: boolean; hasPauses: boolean }): void {
    this.pauseCoherencyOk = state.isCoherent;
    this.hasPauses = state.hasPauses;
  }

  public lunchCoherencyOk = true;

  onLunchStateChange(state: { isCoherent: boolean }): void {
    this.lunchCoherencyOk = state.isCoherent;
  }

  constructor() {
    this.workWellStore.resetAddNewWorkWell();
  }
}

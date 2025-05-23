import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { WwStep1Component } from '../components/ww-step-1/ww-step-1.component';
import { WwStep2Component } from '../components/ww-step-2/ww-step-2.component';
import { SeparatorComponent } from '../../components/separator/separator.component';
import { WwStep3Component } from '../components/ww-step-3/ww-step-3.component';
import { WwStep4Component } from '../components/ww-step-4/ww-step-4.component';
import { WwStep5Component } from '../components/ww-step-5/ww-step-5.component';
import { WorkWellStore } from '../../../store/workWell.store';
import { WorkWell } from '../../../models/workWell.model';

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
export class WwAddNewWorkWellComponent implements OnInit {
  private workWellStore = inject(WorkWellStore);
  public meetingCoherencyOk = true;

  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    if (this.workWellStore.isUpdateState()) {
      this.meetingCoherencyOk = true;
      this.hasPauses = true;
      this.pauseCoherencyOk = true;
    }
  }

  onMeetingStateChange(state: { isCoherent: boolean }): void {
    this.meetingCoherencyOk = state.isCoherent;
  }

  public pauseCoherencyOk = false;
  public hasPauses = false;

  onPauseStateChange(state: { isCoherent: boolean; hasPauses: boolean }): void {
    this.pauseCoherencyOk = state.isCoherent;
    this.hasPauses = state.hasPauses;
    this.cdRef.detectChanges();
  }

  public lunchCoherencyOk = true;

  onLunchStateChange(state: { isCoherent: boolean }): void {
    this.lunchCoherencyOk = state.isCoherent;
  }

  public workDayCoherencyOk = true;

  onWorkDayStateChange(state: { isCoherent: boolean }): void {
    this.workDayCoherencyOk = state.isCoherent;
  }

  public workWellNameCoherencyOk = true;

  onWorkWellNameStateChange(state: { isCoherent: boolean }): void {
    this.workWellNameCoherencyOk = state.isCoherent;
  }
}

import { Component, inject } from '@angular/core';
import { WorkWellStore } from '../../../../store/workWell.store';
import { WorkWell } from '../../../../models/workWell.model';
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'ww-step-2',
  imports: [FormsModule, DatePickerModule],
  templateUrl: './ww-step-2.component.html',
  styleUrl: './ww-step-2.component.scss',
})
export class WwStep2Component {
  private workWellStore = inject(WorkWellStore);
  public addNewWorkWell: WorkWell = this.workWellStore.addNewWorkWell();

  constructor() {
    console.log(this.addNewWorkWell.workWellSchedule[0].workDay.startDate);
  }
}

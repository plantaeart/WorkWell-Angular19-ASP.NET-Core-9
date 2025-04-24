import { Component, inject } from '@angular/core';
import { InputNumberModule } from 'primeng/inputnumber';
import { WorkWellStore } from '../../../../store/workWell.store';
import { WorkWell } from '../../../../models/workWell.model';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { WorkWellScheduleType } from '../../../../../types/enums/workWellScheduleType';

@Component({
  selector: 'ww-step-1',
  imports: [FormsModule, InputNumberModule, SelectButtonModule],
  templateUrl: './ww-step-1.component.html',
  styleUrl: './ww-step-1.component.scss',
})
export class WwStep1Component {
  private workWellStore = inject(WorkWellStore);
  public addNewWorkWell: WorkWell = this.workWellStore.addNewWorkWell();

  stateOptions: any[] = [
    { label: 'Static', value: WorkWellScheduleType.STATIC },
    { label: 'Flexible', value: WorkWellScheduleType.FLEXIBLE },
  ];
}

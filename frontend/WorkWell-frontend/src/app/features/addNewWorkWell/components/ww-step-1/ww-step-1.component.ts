import { Component, EventEmitter, inject, Output } from '@angular/core';
import { InputNumberModule } from 'primeng/inputnumber';
import { WorkWellStore } from '../../../../store/workWell.store';
import { WorkWell } from '../../../../models/workWell.model';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { WorkWellScheduleType } from '../../../../../types/enums/workWellScheduleType';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ww-step-1',
  imports: [
    CommonModule,
    InputTextModule,
    FormsModule,
    InputNumberModule,
    SelectButtonModule,
  ],
  templateUrl: './ww-step-1.component.html',
  styleUrl: './ww-step-1.component.scss',
})
export class WwStep1Component {
  private workWellStore = inject(WorkWellStore);
  public addNewWorkWell: WorkWell = this.workWellStore.addNewWorkWell();

  @Output() workWellNameStateChange = new EventEmitter<{
    isCoherent: boolean;
  }>();

  stateOptions: any[] = [
    { label: 'Static', value: WorkWellScheduleType.STATIC },
    { label: 'Flexible', value: WorkWellScheduleType.FLEXIBLE },
  ];

  // Method to check if the WorkWell name is coherent
  isWorkWellNameCoherent(): boolean {
    const isValid =
      !!this.addNewWorkWell.name && this.addNewWorkWell.name.trim().length >= 3;
    this.workWellNameStateChange.emit({ isCoherent: isValid });
    return isValid;
  }
}

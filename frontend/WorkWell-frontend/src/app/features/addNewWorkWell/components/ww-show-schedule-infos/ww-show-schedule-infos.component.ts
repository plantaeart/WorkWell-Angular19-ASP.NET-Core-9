import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { formatDateToHHmm } from '../../../../utils/string.utils';
import { WorkWellEvent } from '../../../../models/workWellEvent.model';

@Component({
  selector: 'ww-show-schedule-infos',
  imports: [CommonModule],
  templateUrl: './ww-show-schedule-infos.component.html',
  styleUrls: ['./ww-show-schedule-infos.component.scss'],
})
export class WwShowScheduleInfosComponent {
  @Input() workDay: WorkWellEvent | null = null;
  @Input() lunch: WorkWellEvent | null = null;
  @Input() meetings: WorkWellEvent[] = [];
}

import { ButtonSeverity } from 'primeng/button';
import { WorkWellScheduleType } from '../../types/enums/workWellScheduleType';
import { WorkWellSchedule } from './workWellSchedule.model';

export class WorkWell {
  idWWS: number;
  name: string;
  description?: string;
  isPlaying: boolean;
  nbDayWork: number;
  updateDate: Date;
  scheduleType: WorkWellScheduleType;
  workWellSchedule: WorkWellSchedule[];

  constructor(params: {
    idWWS?: number;
    name?: string;
    description?: string;
    isPlaying?: boolean;
    nbDayWork?: number;
    updateDate?: Date;
    scheduleType?: WorkWellScheduleType;
    workWellSchedule?: WorkWellSchedule[];
  }) {
    this.idWWS = params.idWWS || 0;
    this.name = params.name || 'Default WorkWell Name';
    this.description = params.description || '';
    this.isPlaying = params.isPlaying || false;
    this.nbDayWork = params.nbDayWork || 5;
    this.updateDate = params.updateDate || new Date();
    this.scheduleType = params.scheduleType || WorkWellScheduleType.STATIC;
    this.workWellSchedule =
      params.workWellSchedule ||
      new Array<WorkWellSchedule>(new WorkWellSchedule({}));
  }

  public getIsPlayingButtonSeverity(): ButtonSeverity {
    return this.isPlaying ? 'success' : 'secondary';
  }
}

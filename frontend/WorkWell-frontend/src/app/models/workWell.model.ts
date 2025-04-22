import { WorkWellScheduleType } from '../../types/enums/workWellScheduleType';
import { WorkWellSchedule } from './workWellSchedule.model';

export class WorkWell {
  idWWS: number;
  name: string;
  description?: string;
  updateDate: Date;
  scheduleType: WorkWellScheduleType;
  workWellSchedule: WorkWellSchedule[];

  constructor(params: {
    idWWS?: number;
    name?: string;
    description?: string;
    updateDate?: Date;
    scheduleType?: WorkWellScheduleType;
    workWellSchedule?: WorkWellSchedule[];
  }) {
    this.idWWS = params.idWWS || 0;
    this.name = params.name || 'Default WorkWell';
    this.description = params.description || 'Default description';
    this.updateDate = params.updateDate || new Date();
    this.scheduleType = params.scheduleType || WorkWellScheduleType.STATIC;
    this.workWellSchedule = params.workWellSchedule || [
      new WorkWellSchedule({}),
    ];
  }
}

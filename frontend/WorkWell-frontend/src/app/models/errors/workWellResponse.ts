import { WorkWellErrorType } from '../../../types/enums/workWellErrorType';
import { WorkWell } from '../workWell.model';

export class WorkWellResponse {
  data: WorkWell = new WorkWell({});
  errorType: WorkWellErrorType | null = null;
  errorMessage: string | null = null;

  constructor(params: {
    data?: WorkWell;
    errorType?: WorkWellErrorType | null;
    errorMessage?: string | null;
  }) {
    this.data = params.data || new WorkWell({});
    this.errorType = params.errorType || null;
    this.errorMessage = params.errorMessage || null;
  }
}

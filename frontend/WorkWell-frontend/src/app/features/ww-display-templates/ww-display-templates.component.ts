import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { WorkWell } from '../../models/workWell.model';
import { CommonModule } from '@angular/common';
import { WorkWellStore } from '../../store/workWell.store';

@Component({
  selector: 'ww-display-templates',
  imports: [ButtonModule, CommonModule],
  templateUrl: './ww-display-templates.component.html',
  styleUrl: './ww-display-templates.component.scss',
})
export class WwDisplayTemplatesComponent {
  private workWellStore = inject(WorkWellStore);
  public workWellList = this.workWellStore.workWellList;
  public isLoading = this.workWellStore.loading;
}

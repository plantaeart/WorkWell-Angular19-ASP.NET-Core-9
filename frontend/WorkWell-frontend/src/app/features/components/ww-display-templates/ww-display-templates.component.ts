import { Component, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { WorkWellStore } from '../../../store/workWell.store';
import { trigger, transition, style, animate } from '@angular/animations';
import { environment } from '../../../environments/environment.development';
import { Router } from '@angular/router';

@Component({
  selector: 'ww-display-templates',
  imports: [ButtonModule, CommonModule],
  templateUrl: './ww-display-templates.component.html',
  styleUrl: './ww-display-templates.component.scss',
  animations: [
    trigger('listAnimation', [
      // Animation for adding an element
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
      // Animation for removing an element
      transition(':leave', [
        animate(
          '300ms ease-in',
          style({ opacity: 0, transform: 'scale(0.9)' })
        ),
      ]),
    ]),
  ],
})
export class WwDisplayTemplatesComponent {
  public isDebug = signal(environment.debug);

  private workWellStore = inject(WorkWellStore);
  public workWellList = this.workWellStore.workWellList;
  public isLoading = this.workWellStore.loading;
  constructor(private router: Router) {}

  deleteWorkWellByIdFromTemplate = (idWWS: number) => {
    this.workWellStore.deleteWorkWellFromStore(idWWS);
  };

  // Navigate to the "addNewWorkWell" page
  navigateToAddNewWorkWell() {
    this.router.navigate(['/addNewWorkWell']);
  }
}

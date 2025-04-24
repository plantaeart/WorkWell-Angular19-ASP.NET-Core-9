import { Routes } from '@angular/router';
import { WwAddNewWorkWellComponent } from './features/ww-add-new-work-well/ww-add-new-work-well.component';
import { WwDisplayTemplatesComponent } from './features/ww-display-templates/ww-display-templates.component';

export const routes: Routes = [
  { path: '', component: WwDisplayTemplatesComponent }, // Root path
  { path: 'addNewWorkWell', component: WwAddNewWorkWellComponent },
];

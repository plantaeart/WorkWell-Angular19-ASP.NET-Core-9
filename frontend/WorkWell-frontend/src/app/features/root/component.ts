import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WwHeaderComponent } from '../ww-header/ww-header.component';
import { SeparatorComponent } from '../separator/separator.component';
import { WwDisplayTemplatesComponent } from '../ww-display-templates/ww-display-templates.component';

@Component({
  selector: 'root',
  imports: [
    RouterOutlet,
    WwHeaderComponent,
    SeparatorComponent,
    WwDisplayTemplatesComponent,
  ],
  templateUrl: './component.html',
  styleUrl: './component.scss',
})
export class AppComponent {
  title = 'WorkWell-frontend';
}

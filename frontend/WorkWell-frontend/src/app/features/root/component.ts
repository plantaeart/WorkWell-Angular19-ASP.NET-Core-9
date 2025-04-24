import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WwHeaderComponent } from '../components/ww-header/ww-header.component';
import { SeparatorComponent } from '../components/separator/separator.component';
import { WorkWellStore } from '../../store/workWell.store';

@Component({
  selector: 'root',
  imports: [RouterOutlet, WwHeaderComponent, SeparatorComponent],
  templateUrl: './component.html',
  styleUrl: './component.scss',
})
export class AppComponent {
  title = 'WorkWell-frontend';

  private workWellStore = inject(WorkWellStore);

  // Load work wells on initialization
  ngOnInit() {
    this.workWellStore.getAllWorkWellFromStore();
  }
}

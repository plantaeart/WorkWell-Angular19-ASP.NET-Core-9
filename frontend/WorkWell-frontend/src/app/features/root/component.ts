import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WwHeaderComponent } from '../components/ww-header/ww-header.component';
import { SeparatorComponent } from '../components/separator/separator.component';
import { WorkWellStore } from '../../store/workWell.store';
import { WwWorkwellPlayerComponent } from '../ww-workwell-player/ww-workwell-player.component';

@Component({
  selector: 'root',
  imports: [
    RouterOutlet,
    WwHeaderComponent,
    SeparatorComponent,
    WwWorkwellPlayerComponent,
  ],
  templateUrl: './component.html',
  styleUrl: './component.scss',
})
export class AppComponent {
  title = 'WorkWell-frontend';

  private workWellStore = inject(WorkWellStore);

  // Load work wells on initialization
  ngOnInit() {
    this.workWellStore.getAllWorkWellFromStore();
    this.workWellStore.loadingInitialWorkWellPlaying.set(true);
    // Update the workWellPlaying signal
    this.workWellStore.getWorkWellPlaying();
    this.workWellStore.loadingInitialWorkWellPlaying.set(false);
  }
}

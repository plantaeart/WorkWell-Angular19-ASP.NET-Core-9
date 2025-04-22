import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'root',
  imports: [RouterOutlet],
  templateUrl: './component.html',
  styleUrl: './component.scss',
})
export class AppComponent {
  title = 'WorkWell-frontend';
}

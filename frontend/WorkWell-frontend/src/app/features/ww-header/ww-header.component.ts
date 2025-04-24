import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ww-header',
  imports: [],
  templateUrl: './ww-header.component.html',
  styleUrl: './ww-header.component.scss',
})
export class WwHeaderComponent {
  constructor(private router: Router) {}

  navigateToRoot() {
    this.router.navigate(['/']); // Navigate to the root page
  }
}

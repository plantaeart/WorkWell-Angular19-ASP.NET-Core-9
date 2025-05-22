import { Injectable, NgZone } from '@angular/core';
import { Observable, Subject, timer } from 'rxjs';
import { map, share } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TimerService {
  private currentTimeSubject = new Subject<Date>();
  public currentTime$: Observable<Date> =
    this.currentTimeSubject.asObservable();

  constructor(private ngZone: NgZone) {
    this.setupTimer();
  }

  private setupTimer(): void {
    this.ngZone.runOutsideAngular(() => {
      // Calculate ms to next second boundary
      const now = new Date();
      const msToNextSecond = 1000 - now.getMilliseconds();

      // Align to the next second boundary
      setTimeout(() => {
        // Update immediately at the second boundary
        this.currentTimeSubject.next(new Date());

        // Then set up interval precisely aligned with seconds
        timer(0, 1000).subscribe(() => {
          this.currentTimeSubject.next(new Date());
        });
      }, msToNextSecond);
    });

    // Create shared observable that components can subscribe to
    this.currentTime$ = this.currentTimeSubject.asObservable().pipe(share());
  }
}

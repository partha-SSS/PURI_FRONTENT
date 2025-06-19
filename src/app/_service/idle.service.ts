import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IdleService {
  private idleTimer: any;
  private readonly idleDuration = 600000; // 5 minutes in milliseconds
  private idleSubject = new Subject<void>();

  constructor() {
    this.setupIdleTimer();
  }

  private setupIdleTimer(): void {
    this.resetTimer();
    window.addEventListener('mousemove', this.resetTimer.bind(this));
    window.addEventListener('keypress', this.resetTimer.bind(this));
  }

  private resetTimer(): void {
    clearTimeout(this.idleTimer);
    this.idleTimer = setTimeout(() => this.idleSubject.next(), this.idleDuration);
  }

  onIdle(): Observable<void> {
    // debugger
    return this.idleSubject.asObservable();
  }
}
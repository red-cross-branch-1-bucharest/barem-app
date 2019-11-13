import { BehaviorSubject, SubscriptionLike } from 'rxjs';
import { Injury } from 'src/app/types/injury';
import { Component, OnInit, Output, EventEmitter, Input, ViewChild, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { LocationStrategy, Location } from '@angular/common';

@Component({
  selector: 'app-injury',
  templateUrl: './injury.component.html',
  styleUrls: ['./injury.component.scss']
})
export class InjuryComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input()
  set injury(injury: Injury) {
    this.injury$.next(injury);
  }
  injury$ = new BehaviorSubject<Injury | null>(null);
  editInjury$ = new BehaviorSubject<Injury | null>(null);

  @Output() backEmitter = new EventEmitter<boolean>();
  @Output() injuryChanged = new EventEmitter<null>();

  @ViewChild('sidenav', { static: false }) sidenav: MatSidenav;
  @ViewChild('screen', { static: false }) screen: ElementRef;
  scrolling$ = new BehaviorSubject<boolean>(false);

  locationSubscription!: SubscriptionLike;

  constructor(
    private location: Location
  ) { }

  ngOnInit() {
    this.preventBackButton();
  }

  editInjury() {
    this.editInjury$.next(this.injury$.getValue());
  }

  back() {
    // this.editInjury$.next(null);
    this.backEmitter.emit();
  }

  close() {
    this.editInjury$.next(null);
    this.sidenav.close();
  }

  setInjury(injury: Injury) {
    this.injuryChanged.emit();
    if (injury) {
      this.injury$.next(injury);
    } else {
      this.editInjury$.next(null);
      this.sidenav.close();
      this.back();
    }
  }

  ngAfterViewInit() {
    this.screen.nativeElement.addEventListener('scroll', () => {
      const scrollTop = this.screen.nativeElement.scrollTop;
      if (scrollTop > 0 && this.scrolling$.getValue() === false) {
        this.scrolling$.next(true);
      } else if (scrollTop === 0 && this.scrolling$.getValue() === true) {
        this.scrolling$.next(false);
      }
    }, true);
  }

  preventBackButton() {
    this.locationSubscription = this.location.subscribe(() => {
      console.log('injury back');
      if (!this.sidenav.opened) {
        this.back();
      }
      history.pushState(null, null, location.href);
    });
  }

  ngOnDestroy() {
    this.locationSubscription.unsubscribe();
  }

}

import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  Renderer2,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, interval, Subscription, take } from 'rxjs';

@Component({
  selector: 'app-box',
  standalone: true,
  templateUrl: './box.component.html',
  styleUrl: './box.component.css',
  imports: [CommonModule],
})
export class Box implements OnDestroy {
  private _seating1DArrangement: number[] = [];
  private _selectedSequence: string[] = [];
  private _totalAvailableSeatsStatic: number = 0;
  private _intervalSubscription$!: Subscription;
  private _holdSelection$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  
  private _seating2DArrangement: number[][] = [];
  private _selectedSequenceDynamic: string[] = [];
  private _totalAvailableSeatsDynamic: number = 0;

  @Input('seatingArrangements') set seatingArrangements(input: number[][]) {
    this._seating1DArrangement = input.flat();
    this._totalAvailableSeatsStatic = this._seating1DArrangement.reduce(
      (acc, cur) => (acc += cur),
      0
    );
  }

  get seatingArrangements(): number[] {
    return this._seating1DArrangement;
  }

  @Input('seatingArrangements2D') set seatingArrangements2D(input: number[][]) {
    this._totalAvailableSeatsDynamic = input.flat().reduce(
      (acc, cur) => (acc += cur),
      0
    );
    this._seating2DArrangement = input;
  }

  get seatingArrangements2D(): number[][] {
    return this._seating2DArrangement;
  }

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnDestroy(): void {
    this._intervalSubscription$.unsubscribe();
  }

  handleStaticGridClick(event: Event) {
    const target = event.target as HTMLElement;
    if (
      target.classList.contains('visible') &&
      !target.classList.contains('selected') && 
      this._holdSelection$.getValue() === false
    ) {
      const id = target.getAttribute('id') ?? '';
      this.renderer.addClass(target, 'selected');
      this._selectedSequence.push(id);
      this.deselectInSequenceStatic();
    }
  }

  private deselectInSequenceStatic() {
    const selectedSequenceLength = this._selectedSequence.length;
    if (this._totalAvailableSeatsStatic === selectedSequenceLength) {
      this._holdSelection$.next(true);
      this._intervalSubscription$ = interval(500)
        .pipe(take(this._totalAvailableSeatsStatic))
        .subscribe({
          next: (_) => {
          const index = this._selectedSequence.shift();
          const element = this.el.nativeElement
            .querySelector('.box-grid--layout')
            .querySelector(`[id="${index}"]`);
          this.renderer.removeClass(element, 'selected');
        },
        error: (e) => console.log(e),
        complete: () => this._holdSelection$.next(false)
        });
    }
  }

  handleDynamicGridClick(event: Event) {
    const target = event.target as HTMLElement;
    if (
      target.classList.contains('visible') &&
      !target.classList.contains('selected') && 
      this._holdSelection$.getValue() === false
    ) {
      const id = target.getAttribute('id') ?? '';
      this.renderer.addClass(target, 'selected');
      this._selectedSequenceDynamic.push(id);
      this.deselectInSequenceDynamic();
    }
  }

  private deselectInSequenceDynamic() {
    const selectedSequenceLength = this._selectedSequenceDynamic.length;
    if (this._totalAvailableSeatsDynamic === selectedSequenceLength) {
      this._holdSelection$.next(true);
      this._intervalSubscription$ = interval(500)
        .pipe(take(this._totalAvailableSeatsDynamic))
        .subscribe({
          next: (_) => {
          const index = this._selectedSequenceDynamic.shift();
          const element = this.el.nativeElement
            .querySelector('.box-dynamicGrid--layout')
            .querySelector(`[id="${index}"]`);
          this.renderer.removeClass(element, 'selected');
        },
        error: (e) => console.log(e),
        complete: () => this._holdSelection$.next(false)
        });
    }
  }
}

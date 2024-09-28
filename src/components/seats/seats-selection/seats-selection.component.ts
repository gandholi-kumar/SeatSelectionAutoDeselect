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
  selector: 'app-seats-selection',
  standalone: true,
  templateUrl: './seats-selection.component.html',
  styleUrl: './seats-selection.component.css',
  imports: [CommonModule],
})
export class SeatsSelection implements OnDestroy {
  private _rxjsIntervalSubscription$!: Subscription;
  private _disableUserInteraction$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private _seatingArrangement: number[][] = [];
  private _selectedSeatsInSequence: string[] = [];
  private _totalAvailableSeats: number = 0;


  @Input('seatingArrangement') set seatingArrangement(input: number[][]) {
    this._totalAvailableSeats = input.flat().reduce(
      (acc, cur) => (acc += cur),
      0
    );
    this._seatingArrangement = input;
  }

  get seatingArrangement(): number[][] {
    return this._seatingArrangement;
  }

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnDestroy(): void {
    this._rxjsIntervalSubscription$.unsubscribe();
  }

  handleSeatSelectionClick(event: Event) {
    const target = event.target as HTMLElement;
    if (
      target.classList.contains('visible') &&
      !target.classList.contains('selected') && 
      this._disableUserInteraction$.getValue() === false
    ) {
      const id = target.getAttribute('id') ?? '';
      this.renderer.addClass(target, 'selected');
      this._selectedSeatsInSequence.push(id);
      this.deselectInSequenceDynamic();
    }
  }

  private deselectInSequenceDynamic() {
    const selectedSequenceLength = this._selectedSeatsInSequence.length;
    if (this._totalAvailableSeats === selectedSequenceLength) {
      this._disableUserInteraction$.next(true);
      this._rxjsIntervalSubscription$ = interval(500)
        .pipe(take(this._totalAvailableSeats))
        .subscribe({
          next: (_) => {
          const index = this._selectedSeatsInSequence.shift();
          const element = this.el.nativeElement
            .querySelector(`[id="${index}"]`);
          this.renderer.removeClass(element, 'selected');
        },
        error: (e) => console.log(e),
        complete: () => this._disableUserInteraction$.next(false)
        });
    }
  }
}

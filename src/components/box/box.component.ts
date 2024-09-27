import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  Renderer2,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, Subscription, take } from 'rxjs';

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
  private _totalAvailableSeats: number = 0;
  private _intervalSubscription$!: Subscription;

  @Input('seatingArrangements') set seatingArrangements(input: number[][]) {
    this._seating1DArrangement = input.flat();
    this._totalAvailableSeats = this._seating1DArrangement.reduce(
      (acc, cur) => (acc += cur),
      0
    );
  }

  get seatingArrangements(): number[] {
    return this._seating1DArrangement;
  }

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnDestroy(): void {
    this._intervalSubscription$.unsubscribe();
  }

  handleClick(event: Event) {
    const target = event.target as HTMLElement;
    if (
      target.classList.contains('visible') &&
      !target.classList.contains('selected')
    ) {
      const id = target.getAttribute('id') ?? '';
      this.renderer.addClass(target, 'selected');
      this._selectedSequence.push(id);
      this.deselectInSequence();
    }
  }

  private deselectInSequence() {
    const selectedSequenceLength = this._selectedSequence.length;
    if (this._totalAvailableSeats === selectedSequenceLength) {
      this._intervalSubscription$ = interval(500)
        .pipe(take(this._totalAvailableSeats))
        .subscribe((_) => {
          const index = this._selectedSequence.shift();
          const element = this.el.nativeElement
            .querySelector('.box-grid--layout')
            .querySelector(`[id="${index}"]`);
          this.renderer.removeClass(element, 'selected');
        });
    }
  }
}

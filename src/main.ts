import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import { SeatsSelection } from './components/seats/seats-selection/seats-selection.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './main.html',
  imports: [CommonModule, SeatsSelection],
})
export class App implements OnInit {

  seatingArrangement3x3: number[][] = [[1,1,1], [1,0,0], [1,0,1]];
  seatingArrangement5x5: number[][] = [[1,0,1,1,0], [1,0,0, 1,0], [1,0,1,0,1], [1,1,1, 1,1], [0,0,1,1,1]];

  ngOnInit(): void {
    console.log('On init!!');
  }

}

bootstrapApplication(App);

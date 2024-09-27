import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import { Box } from './components/box/box.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './main.html',
  imports: [CommonModule, Box],
})
export class App implements OnInit {

  seatingArrangements: number[][] = [[1,1,1], [1,0,0], [1,0,1]];
  seatingArrangements2: number[][] = [[1,0,1,1,0], [1,0,0, 1,0], [1,0,1,0,1], [1,1,1, 1,1], [0,0,1,1,1]];

  ngOnInit(): void {
    console.log('On init!!');
  }

}

bootstrapApplication(App);

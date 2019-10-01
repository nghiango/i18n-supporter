import {Component, Input, OnInit} from '@angular/core';
import {Square} from '../../ui-models/square';

@Component({
  selector: 'json-square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.scss']
})
export class SquareComponent implements OnInit {
  @Input() square: Square;
  constructor() { }

  ngOnInit() {
    console.log(this.square.backgroundColor);
  }

}

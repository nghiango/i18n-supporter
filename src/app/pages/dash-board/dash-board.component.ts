import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Square} from '../../ui-models/square';
import {SquareBackGroundColorEnum} from '../../ui-models/squareBackGroundColor.enum';

@Component({
  selector: 'json-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.scss']
})
export class DashBoardComponent implements OnInit {
  public squares: Square[] = [];
  constructor(private route: Router,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.squares.push(new Square('Replace', 'Replace old value from original file by the new one',
      'assets/images/icon-edit.png', SquareBackGroundColorEnum.BLUE_BACKGROUND, 'json-replace'));
    this.squares.push(new Square('Tree', 'Show cms as tree to edit',
      'assets/images/icon-edit.png', SquareBackGroundColorEnum.PINK_BACKGROUND, 'json-tree'));
  }

  navigateTo(path: string) {
    this.route.navigate([path]);
  }
}

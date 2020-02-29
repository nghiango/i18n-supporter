import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Square} from '../../ui-models/square';
import {SquareBackGroundColorEnum} from '../../ui-models/squareBackGroundColor.enum';
import { Builder } from 'src/app/shared/buider';

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
    this.squares.push(
      Builder(Square).title('Replace')
      .description('Replace old value from original file by the new one')
      .iconPath('assets/images/icon-edit.png')
      .backgroundColor(SquareBackGroundColorEnum.BLUE_BACKGROUND)
      .pathNavigate('json-replace')
      .build()
    );
    this.squares.push(
      Builder(Square).title('Tree')
      .description('Show cms as tree to edit')
      .iconPath('assets/images/icon-edit.png')
      .backgroundColor(SquareBackGroundColorEnum.PINK_BACKGROUND)
      .pathNavigate('json-tree')
      .build()
    );
  }

  navigateTo(path: string) {
    this.route.navigate([path]);
  }
}

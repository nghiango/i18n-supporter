import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router, Routes} from '@angular/router';

@Component({
  selector: 'json-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.scss']
})
export class DashBoardComponent implements OnInit {

  constructor(private route: Router,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
  }

  navigateTo(replaceJson: string) {
    this.route.navigate(['dashboard/json-replace']);
  }
}

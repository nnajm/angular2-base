import { Component, OnInit } from '@angular/core';
import { DoodleService } from '../../services';
import { DoodleResult } from '../../services/models/doodle-result';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class Dashboard implements OnInit {

  doodleResults: DoodleResult[];

  constructor(private _doodleService: DoodleService) { 
  }

  ngOnInit() {
    console.log('Loading data from database');
      this._doodleService.getAll().subscribe(result => {
        this.doodleResults = result;
      })
  }
}
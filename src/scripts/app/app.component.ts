import { Component } from '@angular/core';
import { Router, ChildActivationEnd } from '@angular/router';
import { DoodleService } from '../services'
import { DoodleResult } from '../services/models/doodle-result';

import '../../styles/app.scss';
import '!style-loader!css-loader!bootstrap/dist/css/bootstrap.min.css';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  selectedDoodle: DoodleResult;

  constructor(
    private _doodleService: DoodleService,
    private _router: Router) {
  }

  ngOnInit() {
    // subscribe to router event
    this._router.events.subscribe((event) => {
      if (event instanceof ChildActivationEnd) {
        const doodleId = event.snapshot.firstChild.params['id'];
        if (doodleId != null) {
          this._doodleService.get(+doodleId).subscribe(result => {
            this.selectedDoodle = result;
          })
        } else {
          this.selectedDoodle = null;
        }
      }
    });
  }
}

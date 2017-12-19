import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable'
import { DoodleResult } from './models/doodle-result';

@Injectable()
export class DoodleService {

  private _dbData = [
    new DoodleResult({
      id: 1,
      label: "Bowling",
      options: [
        { id: 1, label: 'Lu. 18 dec. 2017'},
        { id: 2, label: 'Ma. 19 dec. 2017'},
        { id: 3, label: 'Me. 20 dec. 2017'},
        { id: 4, label: 'Je. 21 dec. 2017'},
        { id: 5, label: 'Ve. 22 dec. 2017'},
      ]
    })
  ];

  get = (doodleId: number) => {
    return Observable.of(this._dbData.find(dr => dr.doodle.id === doodleId));
  }

  getAll = () => {
    return Observable.of(this._dbData);
  }
}
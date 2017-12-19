import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DoodleService } from '../../services'
import { DoodleResult } from '../../services/models/doodle-result';

@Component({
  selector: 'doodle-editor',
  templateUrl: './doodle-editor.component.html',
  styleUrls: ['./doodle-editor.component.scss']
})
export class DoodleEditor {

  doodleResult: DoodleResult;
  participantList: string[];

  constructor(
    private _doodleService: DoodleService,
    private _activatedRoute: ActivatedRoute) {

      this.participantList = [];
  }

  ngOnInit() {
    // subscribe to router event
    this._activatedRoute.params.subscribe(params => {
      const doodleId = params['id'];
      if (doodleId != null) {
        this._doodleService.get(+doodleId).subscribe(result => {
          this.doodleResult = result;
          if(this.doodleResult != null) {
            this.participantList = Object.keys(this.doodleResult.results);
          }
        })
      }
    });
  }

  addParticipant = (participant: string) => {
    if (participant != null &&
      (participant = participant.trim()) !== '' &&
      this.participantList.indexOf(participant) < 0) {
      this.participantList.push(participant);
    }
  }

  toggleOptionSelection = (participant: string, optionId: number) => {
    if (this.doodleResult != null) {
      if (this.doodleResult.isOptionSelected(participant, optionId)) {
        this.doodleResult.removeOption(participant, optionId);
      } else {
        this.doodleResult.selectOption(participant, optionId);
      }
    }
  }
}

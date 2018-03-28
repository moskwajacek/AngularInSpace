import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Pilot } from '../pilot';
import { PilotService } from '../pilot.service';
import { PilotValidators } from '../pilot-validators';

@Component({
  selector: 'app-pilot-form',
  templateUrl: './pilot-form.component.html',
  styleUrls: ['./pilot-form.component.css']
})
export class PilotFormComponent implements OnInit {
  pilot: Pilot;
  form: FormGroup;
  defaultAvatarUrl = Pilot.defaultImageUrl;

  constructor(private pilotService: PilotService,
              private activatedRoute: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.activatedRoute.params
      .subscribe(this.onParamsChanged.bind(this));
  }

  onSubmit() {
    const editedPilot = new Pilot(this.form.value);
    editedPilot.id = this.pilot.id;
    this.pilotService.savePilot(editedPilot)
      .subscribe(this.onSaveSuccess.bind(this), this.onSaveFailure.bind(this));
  }

  private onParamsChanged(params) {
    if (params.id) {
      this.pilotService.getPilot(params.id)
        .subscribe(this.onPilotFetched.bind(this), this.onFetchFailure.bind(this));
    } else {
      this.onPilotFetched(new Pilot());
    }
  }

  private onPilotFetched(pilot: Pilot) {
    this.pilot = pilot;
    this.form = new FormGroup({
      firstName: new FormControl(pilot.firstName, {
        validators: [Validators.required, PilotValidators.pilotName]
      }),
      lastName: new FormControl(pilot.lastName, {
        validators: [Validators.required, PilotValidators.pilotName],
        asyncValidators: [PilotValidators.pilotUniq(this.pilot, this.pilotService)]
      }),
      imageUrl: new FormControl(pilot.imageUrl)
    });
  }

  private onFetchFailure() {
    alert('Nie udało się pobrać pilota');
  }

  private onSaveSuccess() {
    this.router.navigate(['/']);
  }

  private onSaveFailure() {
    alert('Nie udało się zapisać pilota');
  }
}
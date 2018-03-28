import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { SpaceShipType } from '../space-ship-type';
import { SpaceShipFormValues } from '../space-ship-form-values';
import { SpaceShipService } from '../space-ship.service';
import { SpaceShip } from '../space-ship';

@Component({
  selector: 'app-engineers-room',
  templateUrl: './engineers-room.component.html',
  styleUrls: ['./engineers-room.component.css']
})
export class EngineersRoomComponent {
  availableTypes = SpaceShipType;
  initialShipCount = 1;
  initialShipType = SpaceShipType.Fighter;
  isProducing = false;
  shipsCount$: Observable<number>;

  constructor(private spaceShipService: SpaceShipService) {
    this.shipsCount$ = this.spaceShipService.hangarShips$.pipe(
      map((ships: SpaceShip[]) => ships.length)
    );
  }

  onSubmit(formValues: SpaceShipFormValues) {
    this.isProducing = true;
    this.spaceShipService.produceShips(formValues)
        .subscribe({complete: () => this.isProducing = false});
  }

}
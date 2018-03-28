import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { map, take, tap } from 'rxjs/operators';
import { SpaceShip } from './space-ship';
import { SpaceShipFormValues } from './space-ship-form-values';
import { SpaceShipType } from './space-ship-type';
import { FighterShip } from './fighter-ship';
import { BomberShip } from './bomber-ship';
import { timer } from 'rxjs/observable/timer';

@Injectable()
export class SpaceShipService {
  static shipProductionTime = 2000;
  hangarShips$ = new BehaviorSubject<SpaceShip[]>([]);

  constructor() {}

  produceShips(formValues: SpaceShipFormValues): Observable<SpaceShip> {
    const shipClass = formValues.shipType === SpaceShipType.Fighter ? FighterShip : BomberShip;
    return timer(SpaceShipService.shipProductionTime, SpaceShipService.shipProductionTime).pipe(
      map(()=> new shipClass()),
      take(formValues.shipCount),
      tap((spaceShip) => this.hangarShips$.next([...this.hangarShips$.getValue(), spaceShip]))
    );
  }

  removeShip(shipIndex: number) {
    const ships = [...this.hangarShips$.getValue()];
    ships.splice(shipIndex, 1);
    this.hangarShips$.next(ships);
  }
}
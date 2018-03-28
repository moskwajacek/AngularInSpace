import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { Pilot } from './pilot';

@Injectable()
export class PilotService {
  constructor(private http: HttpClient) { }

  getPilots(): Observable<Pilot[]> {
    return this.http.get('/api/pilots').pipe(
      map((data: object[]) => data.map((pilotAttrs) => new Pilot(pilotAttrs)))
    );
  }

  getPilot(id: number): Observable<Pilot> {
    return this.http.get('/api/pilots/' + id).pipe(
      map((data) => new Pilot(data))
    );
  }

  getPilotByLastName(lastName: string): Observable<Pilot> {
    const options = {params: {lastName: lastName}};
    return this.http.get('/api/pilots', options).pipe(
      map((data) => data[0] ? new Pilot(data[0]) : null)
    );
  }

  savePilot(pilot: Pilot): Observable<Pilot> {
    if (pilot.id) {
      return this.updatePilot(pilot);
    } else {
      return this.createPilot(pilot);
    }
  }

  private createPilot(pilot: Pilot): Observable<Pilot> {
    return this.http.post('/api/pilots', pilot).pipe(
      map((data) => new Pilot(data))
    );
  }

  private updatePilot(pilot: Pilot): Observable<Pilot> {
    return this.http.put(`/api/pilots/${pilot.id}`, pilot).pipe(
      map((data) => new Pilot(data))
    );
  }
}
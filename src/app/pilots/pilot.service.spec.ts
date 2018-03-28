import { PilotService } from './pilot.service';
import { Pilot } from './pilot';
import { of } from 'rxjs/observable/of';

class FakeHttp {
  get() {}
  post() {}
  put() {}
}

fdescribe('PilotService', () => {
  let pilotService, httpService;

  beforeEach(() => {
    httpService = new FakeHttp();
    pilotService = new PilotService(httpService);
  });

 describe('getPilots', () => {
    let expectedCollection;

    beforeEach(() => {
      const pilotAttrs = {firstName: 'Mike', lastName: 'Tomsky'};
      spyOn(httpService, 'get').and.returnValue(of([pilotAttrs]));
      pilotService.getPilots().subscribe((pilots) => expectedCollection = pilots);
    });

    it('should make a request for pilots', () => {
      expect(httpService.get).toHaveBeenCalledWith('/api/pilots');
    });

    it('should return collection of pilots', () => {
      expect(expectedCollection[0] instanceof  Pilot).toBeTruthy();
    });
  });

 describe('getPilot', () => {
    let expectedPilot;

    beforeEach(() => {
      const pilotAttrs = {firstName: 'Mike', lastName: 'Tomsky'};
      spyOn(httpService, 'get').and.returnValue(of(pilotAttrs));
      pilotService.getPilot(1).subscribe((pilot) => expectedPilot = pilot);
    });

    it('should make a request for pilot', () => {
      expect(httpService.get).toHaveBeenCalledWith('/api/pilots/1');
    });

    it('should return pilot object', () => {
      expect(expectedPilot instanceof  Pilot).toBeTruthy();
    });
  });

 describe('savePilot', () => {
    let pilot;

    describe('when pilot is persisted', () => {
      beforeEach(() => {
        const pilotAttrs = {id: 1, fullName: 'Mike Tomsky'};
        pilot = new Pilot(pilotAttrs);
        spyOn(httpService, 'put').and.returnValue(of(new Pilot(pilotAttrs)));
        pilotService.savePilot(pilot);
      });

      it('should make post request', () => {
        expect(httpService.put).toHaveBeenCalledWith('/api/pilots/1', pilot);
      });
    });

    describe('when pilot is not persisted', () => {
      beforeEach(() => {
        const pilotAttrs = {id: null, fullName: 'Mike Tomsky'};
        pilot = new Pilot(pilotAttrs);
        spyOn(httpService, 'post').and.returnValue(of(new Pilot({...pilotAttrs, id: 1})));
        pilotService.savePilot(pilot);
      });

      it('should make put request', () => {
        expect(httpService.post).toHaveBeenCalledWith('/api/pilots', pilot);
      });
    });
  });
});
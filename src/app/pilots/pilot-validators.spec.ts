import { FormControl } from '@angular/forms';
import { PilotValidators } from './pilot-validators';
import { Pilot } from './pilot';
import { fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs/observable/of';


describe('PilotValidators', () => {

  fdescribe('pilotName', () => {
    describe('when value is empty', () => {
      it('should return null', () => {
        const control = new FormControl('');
        expect(PilotValidators.pilotName(control)).toBeNull();
      });
    });

    describe('when starts from uppercase letter', () => {
      it('should return null', () => {
        const control = new FormControl('Adam');
        expect(PilotValidators.pilotName(control)).toBeNull();
      });
    });

    describe('when starts from lowcase letter', () => {
      it('should return validation object', () => {
        const control = new FormControl('adam');
        expect(PilotValidators.pilotName(control)).toEqual({pilotName: {valid: false}});
      });
    });
  });

  fdescribe('pilotUniq', () => {
    let control, editedPilot, pilotService, expectedResult, validator;

    beforeEach(() => {
      control = new FormControl('Adam');
      editedPilot = new Pilot({id: 1, firstName: 'Adama'});
      pilotService = { getPilotByLastName: () => {} };
      validator = PilotValidators.pilotUniq(editedPilot, pilotService);
    });

    describe('when other pilot does not exist', () => {
      beforeEach(() => {
        spyOn(pilotService, 'getPilotByLastName').and.returnValue(of(null));
      });

      it('should return observable with null', fakeAsync(() => {
        validator(control).subscribe((result) => expectedResult = result);
        tick(500);
        expect(expectedResult).toBeNull();
      }));
    });

    describe('when pilot exists', () => {
      describe('when pilot is same as edited', () => {
        beforeEach(() => {
          spyOn(pilotService, 'getPilotByLastName').and.returnValue(of(editedPilot));
        });

        it('should return observable with null', fakeAsync(() => {
          validator(control).subscribe((result) => expectedResult = result);
          tick(500);
          expect(expectedResult).toBeNull();
        }));
      });

      describe('when pilot is different then edited', () => {
        beforeEach(() => {
          spyOn(pilotService, 'getPilotByLastName').and.returnValue(of(new Pilot({id: 2, lastName: 'Adamek'})));
        });

        it('should return observable with validation object', fakeAsync(() => {
          validator(control).subscribe((result) => expectedResult = result);
          tick(500);
          expect(expectedResult).toEqual({pilotUniq: {valid: false}});
        }));
      });
    });
  });
});
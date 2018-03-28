import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { Component, Input } from '@angular/core';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';

import { PilotRoomComponent } from './pilot-room.component';
import { PilotService } from '../pilot.service';
import { Pilot } from '../pilot';

@Component({
  selector: 'app-pilot',
  template: 'pilot: {{pilot.fullName}} <ng-content></ng-content>'
})
class FakePilotComponent {
  @Input() pilot;
}

fdescribe('PilotRoomComponent', () => {
  let component: PilotRoomComponent;
  let fixture: ComponentFixture<PilotRoomComponent>;
  let pilotService: PilotService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        PilotRoomComponent,
        FakePilotComponent
      ],
      providers: [
        {provide: PilotService, useValue: {getPilots: () => {}}}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PilotRoomComponent);
    component = fixture.componentInstance;
    pilotService = TestBed.get(PilotService);
  });

  describe('when list fetched successfully', () => {
    let pilot: Pilot;

    beforeEach(() => {
      pilot = new Pilot({fullName: 'Mike Tomsky'});
      spyOn(pilotService, 'getPilots').and.returnValue(of([pilot]));
      fixture.detectChanges();
    });

    it('should display pilots', () => {
      expect(fixture.debugElement.nativeElement.textContent).toContain('Mike')
    });

    it('should not have pilot selected', () => {
      expect(component.selectedPilot).toBeNull();
    });

    describe('when pilot is being selected', () => {
      beforeEach(() => {
        spyOn(component.onPilotSelect, 'emit');
        fixture.debugElement.query(By.css('.select-button')).triggerEventHandler('click', null);
        fixture.detectChanges();
      });

      it('should store selected pilot', () => {
        expect(component.selectedPilot).toBe(pilot);
      });

      it('should emit pilot', () => {
        expect(component.onPilotSelect.emit).toHaveBeenCalledWith(pilot);
      });

      describe('when pilot is being deselected', () => {
        beforeEach(() => {
          fixture.debugElement.query(By.css('.deselect-button')).triggerEventHandler('click', null);
          fixture.detectChanges();
        });

        it('should clear selection', () => {
          expect(component.selectedPilot).toBeNull();
        });

        it('should emit null', () => {
          expect(component.onPilotSelect.emit).toHaveBeenCalledWith(null);
        });
      });
    });

    describe('pilotLeave', () => {
      beforeEach(() => {
        component.pilotLeave(pilot);
        fixture.detectChanges();
      });

      it('should remove pilot from the list', () => {
        expect(fixture.debugElement.nativeElement.textContent).not.toContain('Mike');
      });
    });

    describe('pilotReturn', () => {
      beforeEach(() => {
        const otherPilot = new Pilot({fullName: 'Stewie Griffin'});
        component.pilotReturn(otherPilot);
        fixture.detectChanges();
      });

      it('should display pilot on the list', () => {
        expect(fixture.debugElement.nativeElement.textContent).toContain('Stewie');
      });
    });
  });

  describe('when list fetch failed', () => {
    beforeEach(() => {
      spyOn(pilotService, 'getPilots').and.returnValue(_throw('error'));
      spyOn(window, 'alert');
      fixture.detectChanges();
    });

    it('should display alert with warning', () => {
      expect(window.alert).toHaveBeenCalledWith(jasmine.any(String));
    });
  });
});
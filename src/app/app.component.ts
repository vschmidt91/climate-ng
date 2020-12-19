import { Component } from '@angular/core';
import { Measurement } from './models/measurement';
import { Observable, timer } from 'rxjs';
import { flatMap, map, withLatestFrom } from 'rxjs/operators';
import { DataBaseService } from './services/database.service';
import { MeasurementsService } from './services/measurements.service';
import { SettingsService } from './services/settings.service';
import { Settings } from './models/settings';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'climate-watcher';

  constructor(public measurements: MeasurementsService,
    public settings: SettingsService) {
  }

  getAlias(settings: Settings, code: number): string {
      if(code in settings.aliases) {
        return settings.aliases[code];
      } else {
        return 'Sensor ' + code.toString();
      }
  }

}

import { Component } from '@angular/core';
import { Measurement } from './models/measurement';
import { Observable, timer } from 'rxjs';
import { flatMap, map, withLatestFrom } from 'rxjs/operators';
import { DataBaseService } from './services/database.service';
import { MeasurementsService } from './services/measurements.service';
import { SettingsService } from './services/settings.service';
import { Settings } from 'src/app/models/settings';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'climate-watcher';

  constructor(public measurementsService: MeasurementsService,
    public settingsService: SettingsService) {
  }

}

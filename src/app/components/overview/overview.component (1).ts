import { Component } from '@angular/core';
import { MeasurementsService } from 'src/app/services/measurements.service';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MeasurementView } from 'src/app/components/measurements/measurements.component';
import { SettingsService } from 'src/app/services/settings.service';
import { Settings } from 'src/app/models/settings';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent {

  $views: Observable<MeasurementView[]>

  columns = [
    'sensor',
    'timestamp',
    'humidity',
    'humidity_absolute',
    'temperature',
    'battery',
    'quality'
  ];

  constructor(private measurementsService: MeasurementsService,
    public settingsService: SettingsService) {
    this.$views = measurementsService.$latestMeasurements
      .pipe(map(measurements => measurements.map(m => new MeasurementView(m))));
  }

}

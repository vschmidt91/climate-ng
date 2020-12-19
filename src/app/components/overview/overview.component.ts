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

  constructor(private measurements: MeasurementsService,
    public settings: SettingsService) {
    this.$views = combineLatest(measurements.$measurements, measurements.$ids)
      .pipe(map(([measurements, ids]) => ids.map(id => new MeasurementView(measurements.find(m => m.code === id)))));
  }

  getAlias(settings: Settings, code: number): string {
      if(code in settings.aliases) {
        return settings.aliases[code];
      } else {
        return 'Sensor ' + code.toString();
      }
  }

}

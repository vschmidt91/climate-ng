import { Component, OnInit } from '@angular/core';
import { DataBaseService } from 'src/app/services/database.service';
import { Settings } from 'src/app/models/settings';
import { SettingsService } from 'src/app/services/settings.service';
import { MeasurementsService } from 'src/app/services/measurements.service';

export interface Interval {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {

  intervals: Interval[] = [
    { value: 1, viewValue: '5 Sekunden' },
    { value: 2, viewValue: '10 Sekunden' },
    { value: 3, viewValue: '15 Sekunden' },
    { value: 4, viewValue: '20 Sekunden' },
    { value: 5, viewValue: '30 Sekunden' },
    { value: 6, viewValue: '1 Minute' },
    { value: 7, viewValue: '2 Minuten' },
    { value: 8, viewValue: '5 Minuten' },
    { value: 9, viewValue: '10 Minuten' },
    { value: 10, viewValue: '15 Minuten' },
    { value: 11, viewValue: '20 Minuten' },
    { value: 12, viewValue: '30 Minuten' },
    { value: 13, viewValue: '1 Stunde' },
    { value: 14, viewValue: '2 Stunden' },
    { value: 15, viewValue: '3 Stunden' },
    { value: 16, viewValue: '4 Stunden' },
    { value: 17, viewValue: '6 Stunden' },
    { value: 18, viewValue: '8 Stunden' },
    { value: 19, viewValue: '12 Stunden' },
  ];


  constructor(private db: DataBaseService,
    public settings: SettingsService) {
  }

  async onSubmit(settings: Settings) {
    await this.settings.post(settings);
  }

  async onDeleteMeasurements() {
    await this.db.deleteAllMeasurements();
  }

}

import { Component, OnInit } from '@angular/core';
import { Measurement } from 'src/app/models/measurement';
import { DataBaseService } from '../../services/database.service';
import { Observable, combineLatest } from 'rxjs';
import { map, flatMap } from 'rxjs/operators';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MeasurementsService } from 'src/app/services/measurements.service';
import { SettingsService } from 'src/app/services/settings.service';
import { Settings } from 'src/app/models/settings';
import { MatDialog } from '@angular/material';
import { EditAliasComponent } from '../edit-alias/edit-alias.component';
import * as Chart from 'chart.js'

function toFixed(x: number, n: number): string {
  return (x || 0).toFixed(n).replace('.', ',');
}

export class Duration {
  value: number;
  viewValue: string;
}

export class MeasurementView {

  timestamp: number;
  datetime: string;
  id: number;
  pipe: number;
  code: number;
  humidity: string;
  humidity_absolute: number;
  humidity_absolute_string: string;
  temperature: string;
  battery: string;
  count: number;
  quality: number;
  raw: Measurement;
  selected: Boolean;

  constructor(m: Measurement) {
    this.id = m.id;
    this.pipe = m.pipe;
    this.timestamp = m.timestamp;
    this.datetime = new Date(m.timestamp).toLocaleString();
    this.code = m.code;
    this.humidity = toFixed(m.humidity, 0);
    this.temperature = toFixed(m.temperature, 1);
    this.battery = toFixed(Math.min(100, m.battery), 0);
    this.count = m.count;
    this.quality = 20 * (5 - m.retries);
    this.raw = m;
    this.selected = false;

    let ew = 611.2 * Math.exp(17.62 * m.temperature / (243.12 + m.temperature));
    let rw = 461.52;
    let t = 273.15 + m.temperature;
    let ha = 10 * m.humidity * ew / (rw * t);
    this.humidity_absolute = Math.round(ha * 10) / 10;
    this.humidity_absolute_string = toFixed(ha, 1);
  }

}

function formatTicks(value, index, values) {
  return value.toString().replace('.', ',');
}

function formatDateTick(value, index, values) {
  return new Date(values[index].value).toLocaleString();
}

function createTooltips(unit: string) {
  return (tooltipItem, data) => {
    return new Date(tooltipItem.xLabel).toLocaleString() + ' ' + tooltipItem.yLabel.toString().replace('.', ',') + ' ' + unit;
  };
}

@Component({
  selector: 'app-measurements',
  templateUrl: './measurements.component.html',
  styleUrls: ['./measurements.component.css']
})
export class MeasurementsComponent {

  durations: Duration[] = [
    { value: 1000 * 60, viewValue: '1 Minute' },
    { value: 1000 * 60 * 60, viewValue: '1 Stunde' },
    { value: 1000 * 60 * 60 * 24, viewValue: '1 Tag' },
    { value: 1000 * 60 * 60 * 24 * 7, viewValue: '1 Woche' },
    { value: 1000 * 60 * 60 * 24 * 31, viewValue: '1 Monat' },
    { value: 1000 * 60 * 60 * 24 * 365, viewValue: '1 Jahr' },
  ];

  duration: number;

  chartTemperatureOptions = {
    responsive: true,
    scales: {
      xAxes: [{
        type: 'time',
        ticks: {
          callback: formatDateTick
        }
      }],
      yAxes: [{
        display: true,
        ticks: {
            callback: formatTicks
        }
      }]
    },
    tooltips: {
        callbacks: {
            label: createTooltips('°C')
        }
    }
  };

  chartHumidityOptions = {
    responsive: true,
    scales: {
      xAxes: [{
        type: 'time',
        ticks: {
          callback: formatDateTick
        }
      }],
      yAxes: [{
        display: true,
        ticks: {
            min: 0,
            max: 100,
            callback: formatTicks
        }
      }]
    },
    tooltips: {
        callbacks: {
            label: createTooltips('%')
        }
    }
  };

  chartHumidityAbsoluteOptions = {
    responsive: true,
    scales: {
      xAxes: [{
        type: 'time',
        ticks: {
          callback: formatDateTick
        }
      }],
      yAxes: [{
        display: true,
        ticks: {
            callback: formatTicks
        }
      }]
    },
    tooltips: {
        callbacks: {
            label: createTooltips('g/m³')
        }
    }
  };

  chartTemperature = [];
  chartHumidity = [];
  chartHumidityAbsolute = [];
  chartLabels = [];

  $id: Observable<Number>;
  id: Number;
  $views: Observable<MeasurementView[]>;
  allSelected: Boolean;
  columns = [
    'selected',
    'timestamp',
    'humidity',
    'humidity_absolute',
    'temperature',
    'battery',
    'retries',
    // 'delete',
  ];

  constructor(private db: DataBaseService,
    private measurementsService: MeasurementsService,
    public settingsService: SettingsService,
    private route: ActivatedRoute,
    public dialog: MatDialog) {
    this.duration = this.durations[2].value;
    this.allSelected = false;
    this.$id = route.paramMap
      .pipe(map((params: ParamMap) => Number(params.get('id'))));
    this.$id.subscribe(id => this.id = id);
    let $measurements = this.$id
      .pipe(flatMap(id => this.db.getMeasurementsByCode(id)));
    this.$views = $measurements
      .pipe(map(measurements => measurements.map(m => new MeasurementView(m))));
    this.$views.subscribe(views => this.updateChart(views.slice().reverse()));
    measurementsService.updateLatest();
  }

  updateChart(views: MeasurementView[]): void {
    let now = Date.now();
    let from = now - this.duration;
    let viewsFiltered = views.filter(v => from <= v.timestamp && v.timestamp <= now);
    // let viewsFiltered = views;
    this.chartTemperature = [{
      data: viewsFiltered.map(v => {
        let p = {
          x: v.timestamp,
          y: v.raw.temperature || 0
        }
        return p;
      }),
      label: 'Temperatur (°C)',
      borderColor: '#f00',
      backgroundColor: '#f77',
      pointBorderColor: '#f00',
      pointBackgroundColor: '#f77',
      pointHoverBackgroundColor: '#f77',
      pointHoverBorderColor: 'faa',
      // pointRadius: 0,
      showLine: true,
      lineTension: 0,
    }];
    this.chartHumidity = [{
      data: viewsFiltered.map(v => {
        let p = {
          x: v.timestamp,
          y: v.raw.humidity || 0
        }
        return p;
      }), label: 'Feuchtigkeit (%)',
      borderColor: '#00f',
      backgroundColor: '#77f',
      pointBorderColor: '#00f',
      pointBackgroundColor: '#77f',
      pointHoverBackgroundColor: '#77f',
      pointHoverBorderColor: 'aaf',
      showLine: true,
      lineTension: 0,
    }];
    this.chartHumidityAbsolute = [{
      data: viewsFiltered.map(v => {
        let p = {
          x: v.timestamp,
          y: v.humidity_absolute || 0
        }
        return p;
      }), label: 'Feuchtigkeit (g/m³)',
      borderColor: '#0f0',
      backgroundColor: '#7f7',
      pointBorderColor: '#0f0',
      pointBackgroundColor: '#7f7',
      pointHoverBackgroundColor: '#7f7',
      pointHoverBorderColor: 'afa',
      showLine: true,
      lineTension: 0,
    }];
  }

  async onDeleteMeasurement(view: MeasurementView): Promise<void> {
    await this.db.deleteMeasurement(view.id);
    this.measurementsService.updateLatest();
  }

  async onSetAlias(id: number, settings: Settings): Promise<void> {
    let oldAlias = this.settingsService.getAlias(settings, id);
    const dialogRef = this.dialog.open(EditAliasComponent, { data: oldAlias });
    dialogRef.afterClosed().subscribe(async result => {
      if(!result) return;
      if(result == oldAlias) return;
      settings.aliases[id] = result;
      await this.settingsService.post(settings);
    });
  }

  async onDeleteSelected(views: MeasurementView[]): Promise<void> {
    let actions = views
      .filter(v => v.selected)
      .map(v => this.db.deleteMeasurement(v.raw.id));
    await Promise.all(actions);
    this.measurementsService.updateLatest();
  }

  async onDeleteAll(): Promise<void> {
    await this.db.deleteMeasurementsByCode(this.id);
    this.measurementsService.updateLatest();
  }

  onExportCSV(sensor: string, views: MeasurementView[]): void {
    let csv = views.map(v => {
      let entry = {
        'Zeitpunkt (s)': v.timestamp,
        'Zeitpunkt (Datum)': v.datetime,
        'Feuchtigkeit (%)': v.humidity,
        'Feuchtigkeit (g/m³)': v.humidity_absolute_string,
        'Temperatur (°C)': v.temperature,
        'Batterie (%)': v.battery,
        'ID': v.id,
        'Kanal': v.pipe,
        'Sendercode': v.code,
        'Zähler': v.count,
        'Empfang (%)': v.quality,
      };
      return entry;
    });
    this.downloadCSV(sensor, csv);
  }

  downloadCSV(sensor: string, data: any) {
    const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(';'));
    csv.unshift(header.join(';'));
    let csvArray = csv.join('\r\n');
  
    let a = document.createElement('a');
    let blob = new Blob([csvArray], {type: 'text/csv' })
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob);  
    }
    else {
      let url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = sensor + ".csv";
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }
  }

}

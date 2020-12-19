import { Injectable } from '@angular/core';
import { DataBaseService } from './database.service';
import { BehaviorSubject, Observable, timer, combineLatest } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { Measurement } from '../models/measurement';

@Injectable({
  providedIn: 'root'
})
export class MeasurementsService {
  
  $updateLatest: BehaviorSubject<Number>;

  public $latestMeasurements: Observable<Measurement[]>;
  public $ids: Observable<Number[]>;

  constructor(private db : DataBaseService) {
    this.$updateLatest = new BehaviorSubject(0);
    this.$latestMeasurements = this.$updateLatest
      .pipe(flatMap(t => db.getLatestMeasurements()));
    this.$ids = this.$latestMeasurements
      .pipe(map(measurements => measurements.map(m => m.code)));
    // timer(0, 60e3).subscribe(t => this.update());
  }

  getIDs(measurements: Measurement[]): Number[] {
    return measurements
      .map(m => m.code)
      .filter((ai, i, a) => a.indexOf(ai) === i)
      .sort();
  }

  public updateLatest(): void {
    this.$updateLatest.next(0);
  }

}

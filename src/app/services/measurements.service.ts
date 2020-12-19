import { Injectable } from '@angular/core';
import { DataBaseService } from './database.service';
import { BehaviorSubject, Observable, timer, combineLatest } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { Measurement } from '../models/measurement';

@Injectable({
  providedIn: 'root'
})
export class MeasurementsService {
  
  $update: BehaviorSubject<Number>;

  public $measurements: Observable<Measurement[]>;
  public $ids: Observable<Number[]>;

  constructor(private db : DataBaseService) {
    this.$update = new BehaviorSubject(0);
    this.$measurements = this.$update
      .pipe(flatMap(t => db.getMeasurements()))
      .pipe(map(measurements => measurements.reverse()));
    this.$ids = this.$measurements
      .pipe(map(measurements => this.getIDs(measurements)));
    timer(0, 60e3).subscribe(t => this.update());
  }

  getIDs(measurements: Measurement[]): Number[] {
    return measurements
      .map(m => m.code)
      .filter((ai, i, a) => a.indexOf(ai) === i)
      .sort();
  }

  public update(): void {
    this.$update.next(0);
  }

}

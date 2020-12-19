import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Measurement } from '../models/measurement';
import { Settings } from '../models/settings';

@Injectable({
  providedIn: 'root'
})
export class DataBaseService {

  DB_URL = 'http://climatewatcher:3000/';

  constructor(private http: HttpClient) {
  }

  getMeasurements(): Promise<Measurement[]> {
    return this.http.get<Measurement[]>(`${this.DB_URL}measurements`).toPromise();
  }

  getSettings(): Promise<Settings> {
    return this.http.get<Settings>(`${this.DB_URL}settings`).toPromise();
  }

  postSettings(settings: Settings): Promise<void> {
    return this.http.post<void>(`${this.DB_URL}settings`, settings).toPromise();
  }

  deleteAllMeasurements(): Promise<void> {
    return this.http.delete<void>(`${this.DB_URL}measurements/*`).toPromise();
  }

  deleteMeasurement(id: number): Promise<void> {
    return this.http.delete<void>(`${this.DB_URL}measurements/${id}`).toPromise();
  }

  deleteMeasurements(ids: number[]): Promise<void> {
    return this.http.delete<void>(`${this.DB_URL}measurements/${ids.join(',')}`).toPromise();
  }

}

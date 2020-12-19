import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Measurement } from '../models/measurement';
import { Settings } from '../models/settings';

@Injectable({
  providedIn: 'root'
})
export class DataBaseService {

  DB_URL: string;
  DB_PORT = 3000;

  constructor(private http: HttpClient) {
    let url = location.host;
    this.DB_URL = url;
    let portSeperator = this.DB_URL.lastIndexOf(':');
    if(portSeperator === -1) {
      this.DB_URL = this.DB_URL + ':' + this.DB_PORT;
    } else {
      this.DB_URL = this.DB_URL.substring(0, portSeperator) + ':' + this.DB_PORT;
    }
    if(this.DB_URL.startsWith('http://') === false) {
      this.DB_URL = 'http://' + this.DB_URL;
    }
  }

  getLatestMeasurements(): Promise<Measurement[]> {
    return this.http.get<Measurement[]>(`${this.DB_URL}/measurements/latest`).toPromise();
  }

  getMeasurements(): Promise<Measurement[]> {
    return this.http.get<Measurement[]>(`${this.DB_URL}/measurements`).toPromise();
  }

  getMeasurementsByCode(code: Number): Promise<Measurement[]> {
    return this.http.get<Measurement[]>(`${this.DB_URL}/measurements/${code}`).toPromise();
  }

  getSettings(): Promise<Settings> {
    return this.http.get<Settings>(`${this.DB_URL}/settings`).toPromise();
  }

  postSettings(settings: Settings): Promise<void> {
    return this.http.post<void>(`${this.DB_URL}/settings`, settings).toPromise();
  }

  deleteMeasurement(id: number): Promise<void> {
    return this.http.delete<void>(`${this.DB_URL}/measurements/${id}`).toPromise();
  }

  deleteAllMeasurements(): Promise<void> {
    return this.http.delete<void>(`${this.DB_URL}/measurements`).toPromise();
  }

  deleteMeasurementsByCode(code: Number): Promise<void> {
    return this.http.delete<void>(`${this.DB_URL}/measurements/${code}`).toPromise();
  }

}

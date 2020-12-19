import { Injectable, OnInit } from '@angular/core';
import { DataBaseService } from './database.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { Settings } from '../models/settings';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  
  $update: BehaviorSubject<Number>;

  public $settings: Observable<Settings>;

  constructor(private db : DataBaseService) {
    this.$update = new BehaviorSubject(0);
    this.$settings = this.$update
      .pipe(flatMap(t => db.getSettings()));
  }

  public update(): void {
    this.$update.next(0);
  }

  public async post(settings: Settings): Promise<void> {
    await this.db.postSettings(settings);
    this.update();
  }

  public getAlias(settings: Settings, id: number): string {
    if (id in settings.aliases) {
        return settings.aliases[id] + ' (' + id.toString() + ')';
    } else {
        return 'Sensor ' + id.toString();
    }
  }

}

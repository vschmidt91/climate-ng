import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MeasurementsComponent } from './components/measurements/measurements.component';
import { SettingsComponent } from './components/settings/settings.component';
import { OverviewComponent } from './components/overview/overview.component';

const routes: Routes = [
  { path: 'measurements/:id', component: MeasurementsComponent },
  { path: '', component: OverviewComponent },
  { path: 'settings', component: SettingsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }

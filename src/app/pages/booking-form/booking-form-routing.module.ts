import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BookingFormPage } from './booking-form.page';

const routes: Routes = [
  {
    path: '',
    component: BookingFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookingFormPageRoutingModule {}

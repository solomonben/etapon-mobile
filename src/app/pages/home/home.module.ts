import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { BookingSlipComponent } from 'src/app/components/booking-slip/booking-slip.component';
import { BookingCardComponent } from 'src/app/components/booking-card/booking-card.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule
  ],
  declarations: [HomePage, BookingSlipComponent, BookingCardComponent] 
})
export class HomePageModule {}

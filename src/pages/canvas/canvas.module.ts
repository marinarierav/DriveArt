import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CanvasPage } from './canvas';

@NgModule({
  declarations: [
    CanvasPage,
  ],
  imports: [
    IonicPageModule.forChild(CanvasPage),
  ],
})
export class CanvasPageModule {}

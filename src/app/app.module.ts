import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { CanvasPage } from '../pages/canvas/canvas';

import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { DeviceMotion } from '@ionic-native/device-motion';
//import { CanvasDraw } from '../components/canvas-draw/canvas-draw';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TabsPage,
    CanvasPage,
    //CanvasDraw
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TabsPage,
    CanvasPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BluetoothSerial,
    DeviceMotion,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}

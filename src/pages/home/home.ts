import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { AlertController, ToastController } from 'ionic-angular';

import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion';
import { DeviceMotionAccelerometerOptions} from '@ionic-native/device-motion';

import { Platform } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  //deviceMotion
  data : any;
  dir : string = "";
  dir_coord : string = "";
  subscription : any;

  //bluetooth
  pairedList: pairedlist;
  listToggle: boolean = false;
  pairedDeviceID: number = 0;
  dataSend: string = "";

  status: string = "Connect";
  status_color: string = 'primary';

  //brush color
  color1: boolean = true;
  color2: boolean = true;
  color_b1: string = "primary";
  color_b2: string = "dark";
  outline_b1: boolean = false;
  outline_b2: boolean = false;

  constructor(  public navCtrl: NavController,
                private alertCtrl: AlertController,
                private bluetoothSerial: BluetoothSerial,
                private toastCtrl: ToastController,
                private deviceMotion: DeviceMotion,
                public platform: Platform
              ) {
    this.checkBluetoothEnabled();
  }


  /*****************************
  *** Bluetooth              ***
  *****************************/
  checkBluetoothEnabled() {
    this.bluetoothSerial.isEnabled().then(success => {
      this.listPairedDevices();
    }, error => {
      this.showError("Please Enable Bluetooth")
    });
  }

  listPairedDevices() {
    this.bluetoothSerial.list().then(success => {
      this.pairedList = success;
      this.listToggle = true;
    }, error => {
      this.showError("Please Enable Bluetooth")
      this.listToggle = false;
    });
  }

  selectDevice() {
    let connectedDevice = this.pairedList[this.pairedDeviceID];
    if (!connectedDevice.address) {
      this.showError('Select Paired Device to connect');
      return;
    }
    let address = connectedDevice.address;
    let name = connectedDevice.name;

    this.connect(address);
  }

  connect(address) {
    // Attempt to connect device with specified address, call app.deviceConnected if success
    this.bluetoothSerial.connect(address).subscribe(success => {
      this.deviceConnected();
      this.showToast("Successfully Connected");
    }, error => {
      this.showError("Error:Connecting to Device");
    });
  }

  deviceConnected() {
    // Subscribe to data receiving as soon as the delimiter is read
    this.bluetoothSerial.subscribe('\n').subscribe(success => {
      this.handleData(success);
      this.status = "Connected";
      this.status_color = "secondary";
      
      this.showToast("Connected Successfullly");
    }, error => {
      this.showError(error);
    });
  }

  deviceDisconnected() {
    // Unsubscribe from data receiving
    this.status = "Connect";
    this.status_color = "primary";
    this.bluetoothSerial.disconnect();
    this.showToast("Device Disconnected");
  }

  handleData(data) {
    this.showToast(data);
  }

  sendData() {
    this.dataSend+='\n';
    //this.showToast(this.dataSend);

    this.bluetoothSerial.write(this.dataSend).then(success => {
      //this.showToast(success);
    }, error => {
      this.showError(error)
    });
  }

  showError(error) {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: error,
      buttons: ['Dismiss']
    });
    alert.present();
  }

  showToast(msj) {
    const toast = this.toastCtrl.create({
      message: msj,
      duration: 1000
    });
    toast.present();

  }

  /*****************************
  *** Accelerometre.         ***
  *****************************/
  startWatching(){
    if (this.platform.is('cordova')) {

    var options: DeviceMotionAccelerometerOptions = {
      frequency: 150
    };

    this.subscription = this.deviceMotion.watchAcceleration(options).subscribe((acceleration: DeviceMotionAccelerationData) => {
      this.data = acceleration;
      this.checkDir();
    })
  }
  }

  checkDir(){
    let move = false;
    if(this.data.y<-3){ //forward
      move=true;
      this.dir='4';
      this.dir_coord="UP";
    }else if(this.data.y>3){ //backward
      move=true;
      this.dir='3';
      this.dir_coord="DOWN";
    }

    if(this.data.x<-3){ //turn right
      move=true;
      this.dir='1';
      this.dir_coord="RIGHT";
    }else if(this.data.x>3){ //turn left
      move=true;
      this.dir='2';
      this.dir_coord="LEFT";
    }

    if(move){
    this.dataSend = this.dir;
    this.sendData();
    }else{
      this.dir_coord="STILL"
    }

  }

  stopWatching(){
    if (this.platform.is('cordova')) {

      this.subscription.unsubscribe();
    }
  }

  /*****************************
  *** Brush color.           ***
  *****************************/
  setColor1(){
    this.color1 = !this.color1;
    this.outline_b1 = !this.outline_b1;

    console.log('setting color 1...');

    //if(this.status=="Connected"){
      console.log('sending color 1...');

      if(this.color1) this.dataSend = '5';
      if(!this.color1) this.dataSend = '6';
      this.sendData();
    //}
  }

  setColor2(){
    this.color2 = !this.color2;
    this.outline_b2 = !this.outline_b2;

    console.log('setting color 2...');

    //if(this.status=="Connected"){
      console.log('sending color 2...');

      if(this.color2) this.dataSend = '7';
      if(!this.color2) this.dataSend = '8';
      this.sendData();
    //}
  }


}

interface pairedlist {
  "class": number,
  "id": string,
  "address": string,
  "name": string
}
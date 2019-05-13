import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Component, ViewChild, Renderer } from '@angular/core';
import { Platform } from 'ionic-angular';

import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion';
import { DeviceMotionAccelerometerOptions} from '@ionic-native/device-motion';

@IonicPage()
@Component({
  selector: 'page-canvas',
  templateUrl: 'canvas.html',
})
export class CanvasPage {

  @ViewChild('myCanvas') canvas: any;

  canvasElement: any;
  lastX: number;
  lastY: number;

  currentColour: string = '#1abc9c';
  brushSize: number = 10;

    //deviceMotion
    data : any;
    dir : string = "";
    dir_coord : string = "";
    subscription : any;

  constructor(  public navCtrl: NavController,
                public navParams: NavParams,
                public platform: Platform,
                public renderer: Renderer,
                private deviceMotion: DeviceMotion,
              )
  {

    this.lastX = this.platform.width()/2;
    this.lastY = this.platform.height()/2;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CanvasPage');
  }

  ngAfterViewInit(){
    this.canvasElement = this.canvas.nativeElement;

    this.renderer.setElementAttribute(this.canvasElement, 'width', this.platform.width() + '');
    this.renderer.setElementAttribute(this.canvasElement, 'height', this.platform.height() + '');
  }

  changeColour(colour){
    this.currentColour = colour;
  }

  changeSize(size){
      this.brushSize = size;
  }

  handleStart(ev){
    console.log("START AT:" + ev);

    this.lastX = ev.touches[0].pageX;
    this.lastY = ev.touches[0].pageY;
  }

  handleMove(ev){
    console.log("MOVE AT:" + ev);

    let currentX = ev.touches[0].pageX;
    let currentY = ev.touches[0].pageY;

    this.draw(currentX, currentY);

  }


  draw(currentX,currentY){
    let ctx = this.canvasElement.getContext('2d');

    ctx.beginPath();
    ctx.lineJoin = "round";
    ctx.moveTo(this.lastX, this.lastY);
    ctx.lineTo(currentX, currentY);
    ctx.closePath();
    ctx.strokeStyle = this.currentColour;
    ctx.lineWidth = this.brushSize;
    ctx.stroke();  

    this.lastX = currentX;
    this.lastY = currentY;
  }
  
  handleEnd(ev){
    console.log("END AT:" + ev);
  }

  clearCanvas(){
    let ctx = this.canvasElement.getContext('2d');
    ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);   
  }




  /*****************************
  *** Accelerometre.         ***
  *****************************/
  startWatching(){
    if (this.platform.is('cordova')) {

    var options: DeviceMotionAccelerometerOptions = {
      frequency: 500
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

      this.draw(this.lastX, this.lastY-10);

    }else if(this.data.y>3){ //backward
      move=true;
      this.dir='3';
      this.dir_coord="DOWN";

      this.draw(this.lastX, this.lastY+10);

    }

    if(this.data.x<-3){ //turn right
      move=true;
      this.dir='1';
      this.dir_coord="RIGHT";

      this.draw(this.lastX+10, this.lastY);

    }else if(this.data.x>3){ //turn left
      move=true;
      this.dir='2';
      this.dir_coord="LEFT";

      this.draw(this.lastX-10, this.lastY);

    }

    if(move){
    //this.dataSend = this.dir;
    //this.sendData();
    }else{
      this.dir_coord="STILL"
    }

  }

  stopWatching(){
    if (this.platform.is('cordova')) {

      this.subscription.unsubscribe();
    }
  }


}

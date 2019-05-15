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
  alfa: number;
  step: number = 5; //constant
  angular_step: number = 10; //constant

  currentColour: string = '#1abc9c';
  brushSize: number = 10;

    //deviceMotion
    data : any;
    dir : string = "";
    dir_coord : string = "";
    subscription : any;

  img: HTMLImageElement;
  cursor_size: number = 30;
  offset: number = 80;

  constructor(  public navCtrl: NavController,
                public navParams: NavParams,
                public platform: Platform,
                public renderer: Renderer,
                private deviceMotion: DeviceMotion,
              )
  {

    this.lastX = this.platform.width()/2;
    this.lastY = this.platform.height()/2;
    this.alfa = 0;

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CanvasPage');
    this.img = <HTMLImageElement>document.getElementById('spaceship');
    console.log(this.img);
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
    ctx.moveTo(this.lastX, this.lastY-this.offset);
    ctx.lineTo(currentX, currentY-this.offset);
    ctx.closePath();
    ctx.strokeStyle = this.currentColour;
    ctx.lineWidth = this.brushSize;
    ctx.stroke();  

    
    
    ctx.save();
    ctx.translate(currentX-this.cursor_size/2,currentY-this.cursor_size/2-this.offset);
    ctx.drawImage(this.img, 0, 0, this.cursor_size, this.cursor_size);
    ctx.restore();
    

    this.lastX = currentX;
    this.lastY = currentY;
  }
  
  handleEnd(ev){
    console.log("END AT:" + ev);
  }

  clearCanvas(){
    this.lastX = this.platform.width()/2;
    this.lastY = this.platform.height()/2;
    this.alfa = 0;

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

      let currentX = this.lastX - Math.sin(this.alfa)*this.step;
      let currentY = this.lastY - Math.cos(this.alfa)*this.step;

      this.draw(this.lastX, this.lastY-10);
      //this.draw(currentX, currentY);

    }else if(this.data.y>3){ //backward
      move=true;
      this.dir='3';
      this.dir_coord="DOWN";

      let currentX = this.lastX + Math.sin(this.alfa)*this.step;
      let currentY = this.lastY + Math.cos(this.alfa)*this.step;

      this.draw(this.lastX, this.lastY+10);
      //this.draw(currentX, currentY);

    }

    if(this.data.x<-3){ //turn right
      move=true;
      this.dir='1';
      this.dir_coord="RIGHT";

      this.alfa-=this.angular_step;

      let currentX = this.lastX + Math.sin(this.alfa)*this.step*0.5;
      let currentY = this.lastY + Math.cos(this.alfa)*this.step*0.5;
      //this.draw(currentX, currentY);
      this.draw(this.lastX+10, this.lastY);

    }else if(this.data.x>3){ //turn left
      move=true;
      this.dir='2';
      this.dir_coord="LEFT";

      this.alfa+=this.angular_step;

      let currentX = this.lastX + Math.sin(this.alfa)*this.step*0.5;
      let currentY = this.lastY + Math.cos(this.alfa)*this.step*0.5;
      this.draw(currentX, currentY);

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

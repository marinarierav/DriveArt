import { Component, ViewChild, Renderer } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { DeviceMotion, DeviceMotionAccelerometerOptions, DeviceMotionAccelerationData } from '@ionic-native/device-motion';

/**
 * Generated class for the CanvasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

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
    subscription : any = null;

  img: HTMLImageElement;
  cursor_size: number = 30;
  offset: number = 80;

  points: Array<{x: number, y:number}> = [];

  constructor(  public navCtrl: NavController,
                public navParams: NavParams,
                public platform: Platform,
                public renderer: Renderer,
                private deviceMotion: DeviceMotion,
              )
  {

    this.lastX = this.platform.width()/2;
    this.lastY = this.platform.height()/2+this.offset;

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

  
  /*****************************
  *** Drawing.               ***
  *****************************/

  handleStart(ev){
    console.log("START AT:", ev);

    this.lastX = ev.touches[0].pageX;
    this.lastY = ev.touches[0].pageY;
  }

  handleMove(ev){
    console.log("MOVE AT:", ev);

    let currentX = ev.touches[0].pageX;
    let currentY = ev.touches[0].pageY;

    this.draw(currentX, currentY);

  }


  draw(currentX,currentY){

    this.points.push({x: currentX, y: currentY});

    let ctx = this.canvasElement.getContext('2d');
    ctx.beginPath();
    ctx.lineJoin = "round";
    ctx.moveTo(this.lastX, this.lastY-this.offset);
    //ctx.moveTo(this.penultimateX, this.penultimateY-this.offset);
    ctx.lineTo(currentX, currentY-this.offset);
    //ctx.quadraticCurveTo(this.lastX, this.lastY-this.offset, currentX, currentY-this.offset);
    ctx.closePath();
    ctx.strokeStyle = this.currentColour;
    ctx.lineWidth = this.brushSize;
    ctx.stroke();

    
    /*
    ctx.save();
    ctx.translate(currentX-this.cursor_size/2,currentY-this.cursor_size/2-this.offset);
    ctx.drawImage(this.img, 0, 0, this.cursor_size, this.cursor_size);
    ctx.restore();
    */

    this.lastX = currentX;
    this.lastY = currentY;
  }
  
  handleEnd(ev){
    console.log("END AT:" + ev);
  }

  clearCanvas(deletePoints: boolean){
    this.lastX = this.platform.width()/2;
    this.lastY = this.platform.height()/2;
    this.alfa = 0;

    console.log("bool:" + deletePoints);
    if(deletePoints==true){
      console.log("He entrat, bool:" + deletePoints);
      this.points.length = 0;
    }

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
    if (this.subscription != null) {

      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }


  /*****************************
  *** Filtering.             ***
  *****************************/

  filter(){
    if (this.points.length === 0) return;
    
    let ctx = this.canvasElement.getContext('2d');
    ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);

    ctx.beginPath();
    ctx.lineJoin = "round";

    ctx.moveTo(this.points[0].x, this.points[0].y-this.offset);

    let i;
    for (i = 1; i <= this.points.length-3; i+=3)
    {
      //var xc = (this.points[i].x + this.points[i + 1].x) / 2;
      //var yc = (this.points[i].y + this.points[i + 1].y) / 2;
       ctx.bezierCurveTo(this.points[i].x, this.points[i].y-this.offset, this.points[i+1].x, this.points[i+1].y-this.offset, this.points[i+2].x, this.points[i+2].y-this.offset);
    }
    // curve through the last two points
    //ctx.bezierCurveTo(this.points[i].x, this.points[i].y-this.offset, this.points[i+1].x, this.points[i+1].y-this.offset, this.points[i+2].x, this.points[i+2].y-this.offset);
    ctx.moveTo(this.points[0].x, this.points[0].y-this.offset);

    ctx.closePath();
    ctx.strokeStyle = this.currentColour;
    ctx.lineWidth = this.brushSize;
    ctx.stroke();
  }

}

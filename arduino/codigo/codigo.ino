#include <SoftwareSerial.h>
#include <Servo.h>

// declaraciones y inicializaciones de PINs y otras variables.
Servo myservo;
Servo myservo2;
SoftwareSerial BTSerial(10, 11); // RX | TX
char dato = '9'; // dato que leemos del bluetooth
int color = 0; //color del dibujo

// motor1
int IN1 = 2;
int IN2 = 8;
int motor1_ena = 5;

// motor2
int IN3 = 4; 
int IN4 = 7;
int motor2_ena = 6;

// ultrasonidos
int trigPin = 12;
int echoPin = 13;
long duration, cm, inches;

// inicializaciones
void setup() 
{
  myservo.attach(3);
  myservo2.attach(9);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(LED_BUILTIN, OUTPUT);
  pinMode( motor1_ena , OUTPUT);
  pinMode( motor2_ena , OUTPUT);
  pinMode (IN1, OUTPUT);
  pinMode (IN2, OUTPUT);
  pinMode (IN4, OUTPUT);
  pinMode (IN3, OUTPUT);
  analogWrite( motor1_ena , 250);
  analogWrite( motor2_ena , 250);
  pinMode(9, OUTPUT);
  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(9, HIGH);
  Serial.begin(9600);
  Serial.println("Ready");
  BTSerial.begin(38400); // comunicacion bluetooth
}

// funcion que detiene el robot
void Mover_Stop()
{
  digitalWrite( IN1, LOW);
  digitalWrite( IN2, LOW );
  digitalWrite( IN3, LOW);
  digitalWrite( IN4, LOW );
}

// codigo principal
void loop()
{  
  if (BTSerial.available())
  {
    dato = BTSerial.read(); // leemos dato bluetooth
    Serial.write(dato);
    if(dato=='1'){ // giro derecha
      digitalWrite( IN1, HIGH);
      digitalWrite( IN2, LOW );
      digitalWrite( IN3, HIGH);
      digitalWrite( IN4, LOW );
    }
    if(dato=='2'){ // giro izquierda
      digitalWrite( IN1, LOW);
      digitalWrite( IN2, HIGH);
      digitalWrite( IN3, LOW);
      digitalWrite( IN4, HIGH); 
    }
    if(dato=='3'){ // marcha atras
      digitalWrite( IN1, HIGH);
      digitalWrite( IN2, LOW );
      digitalWrite( IN3, LOW);
      digitalWrite( IN4, HIGH );
    }
    if(dato=='4'){ // adelante
      // leer ultrasonidos
      digitalWrite(trigPin, LOW);
      delayMicroseconds(5);
      digitalWrite(trigPin, HIGH);
      delayMicroseconds(10);
      digitalWrite(trigPin, LOW);
      
      pinMode(echoPin, INPUT);
      duration = pulseIn(echoPin, HIGH);
      cm = (duration/2) / 29.1;
      Serial.write(cm);
      
      // comprueba distancia de seguridad para evitar que choque
      if (cm>10){
        digitalWrite( IN1, LOW);
        digitalWrite( IN2, HIGH );
        
        digitalWrite( IN3, HIGH);
        digitalWrite( IN4, LOW );
      }
    }
    if(dato=='7'){ // seleccion color1
      myservo.write(100);
    }
    if(dato=='8'){ // deseleccion color1
      myservo.write(60);
    }
    if(dato=='5'){ // seleccion color2
      myservo2.write(100);
    }
    if(dato=='6'){ // deseleccion color2
      myservo2.write(140);
    }
  } 
  delay(50);
  Mover_Stop(); // detener coche
  //while(BTSerial.available()>0) BTSerial.read();
  //delay(100);
}

#include <wiringPi.h>
#include <stdio.h>
#include <softPwm.h>
#include <math.h>
#include <stdlib.h>

#define motorPin1 2
#define motorPin2 0
#define enablePin 3

void motor(int ADC){
	int value = ADC;
	if(value>0){
		digitalWrite(motorPin1,HIGH);
		digitalWrite(motorPin2,LOW);
		printf("turn Forward...\n");
	}
	else if (value<0){
		digitalWrite(motorPin1,LOW);
		digitalWrite(motorPin2,HIGH);
		printf("turn Back...\n");
	}
	else {
		digitalWrite(motorPin1,LOW);
		digitalWrite(motorPin2,LOW);
		printf("Motor Stop...\n");
	}
	softPwmWrite(enablePin, 100);
	printf("The PWM duty cycle is %d%%\n",abs(value)*100/127);//print the PMW duty cycle
}

int main(void){
	wiringPiSetup();
	pinMode(enablePin,OUTPUT);//set mode for the pin
	pinMode(motorPin1,OUTPUT);
	pinMode(motorPin2,OUTPUT);
	softPwmCreate(enablePin,0,100);//define PMW pin
	
	while(1){
		int value = -100;
		//read analog value of A0 pin
		//printf("ADC value : %d \n",value);
		motor(value);
		//make the motor rotate with speed(analog value of A0 pin)
		delay(100);
	}
	return 0;
}

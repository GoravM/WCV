#include <iostream>
#include <cstring>
#include <sys/socket.h>
#include <netinet/in.h>
#include <unistd.h>

#include <wiringPi.h>
#include <stdio.h>
#include <softPwm.h>
#include <math.h>
#include <stdlib.h>

#define PORT 65432  // The port number on which the server listens

#define motorPin1 2
#define motorPin2 0
#define enablePin1 3

// SECOND SET OF MOTOR PINS
#define motorPin3 4    // blue
#define motorPin4 1    // red
#define enablePin2 5   // bot blue

int main() {
    int server_fd, new_socket;
    struct sockaddr_in address;
    int addrlen = sizeof(address);
    char buffer[1024] = {0};  // Buffer to store client messages

    //Create the socket
    if ((server_fd = socket(AF_INET, SOCK_STREAM, 0)) == 0) {
        std::cerr << "Socket creation failed!" << std::endl;
        return -1;
    }

    //Set up the server address
    address.sin_family = AF_INET;  // IPv4
    address.sin_addr.s_addr = INADDR_ANY;  // Listen on all network interfaces
    address.sin_port = htons(PORT);  // Convert to network byte order (big-endian)

    //Bind the socket to the specified port
    if (bind(server_fd, (struct sockaddr *)&address, sizeof(address)) < 0) {
        std::cerr << "Bind failed!" << std::endl;
        return -1;
    }

    //Start listening for incoming connections
    if (listen(server_fd, 3) < 0) {
        std::cerr << "Listen failed!" << std::endl;
        return -1;
    }

    std::cout << "Server is running on port " << PORT << "..." << std::endl;

    // SET UP THE MOTORS
    wiringPiSetup();
	pinMode(enablePin1,OUTPUT);//set mode for the pin
	pinMode(motorPin1,OUTPUT);
	pinMode(motorPin2,OUTPUT);
	softPwmCreate(enablePin1,0,100);//define PMW pin

	pinMode(enablePin2,OUTPUT);//set mode for the pin
	pinMode(motorPin3,OUTPUT);
	pinMode(motorPin4,OUTPUT);
	softPwmCreate(enablePin2,0,100);//define PMW pin

// Run the server continuously to accept client connections
    while (true) {
        // Accept a client connection (blocking call)
        if ((new_socket = accept(server_fd, (struct sockaddr *)&address, (socklen_t*)&addrlen)) < 0) {
            std::cerr << "Accept failed!" << std::endl;
            return -1;
        }
        int speed1 = 100;
        int speed2 = 100;

        const char *response = "";
        int bytes_read = read(new_socket, buffer, 1024);
        
        if (bytes_read > 0) {
            std::cout << "Received: " << buffer << std::endl;
            if (strcmp(buffer, "forward") == 0) {
                digitalWrite(motorPin1, HIGH);
                digitalWrite(motorPin2, LOW);
                softPwmWrite(enablePin1, speed1);

                digitalWrite(motorPin3, LOW);
                digitalWrite(motorPin4, HIGH);
                softPwmWrite(enablePin2, speed2);

                response = "Moving forward...";
                std::cout << "Moving forward..." << std::endl;
            } else if (strcmp(buffer, "reverse") == 0) {
                digitalWrite(motorPin1, LOW);
                digitalWrite(motorPin2, HIGH);
                softPwmWrite(enablePin1, speed1);

                digitalWrite(motorPin3, HIGH);
                digitalWrite(motorPin4, LOW);
                softPwmWrite(enablePin2, speed2);

                response = "Moving backward...";
                std::cout << "Moving backward..." << std::endl;
            } else if (strcmp(buffer, "stop") == 0) {
                speed1 = 0;
                speed2 = 0;

                digitalWrite(motorPin1, HIGH);
                digitalWrite(motorPin2, LOW);
                softPwmWrite(enablePin1, speed1);

                digitalWrite(motorPin3, HIGH);
                digitalWrite(motorPin4, LOW);
                softPwmWrite(enablePin2, speed2);

                response = "Stopping...";
                std::cout << "Stopping..." << std::endl;
            } else if (strcmp(buffer, "left") == 0) {
                digitalWrite(motorPin1, HIGH);
                digitalWrite(motorPin2, LOW);
                softPwmWrite(enablePin1, speed1);

                digitalWrite(motorPin3, LOW);
                digitalWrite(motorPin4, HIGH);
                softPwmWrite(enablePin2, speed2);

                response = "Turning left...";
                std::cout << "Turning left..." << std::endl;
            } else if (strcmp(buffer, "right") == 0) {
                digitalWrite(motorPin1, LOW);
                digitalWrite(motorPin2, HIGH);
                softPwmWrite(enablePin1, speed1);

                digitalWrite(motorPin3, HIGH);
                digitalWrite(motorPin4, LOW);
                softPwmWrite(enablePin1, speed2);

                response = "Turning right...";
                std::cout << "Turning right..." << std::endl;
            } else {

                response = "Invalid command!";
                std::cout << "Invalid command!" << std::endl;
            }
            // Send a response back to the client

            send(new_socket, response, strlen(response), 0);
            std::cout << "Response sent to client." << std::endl;
        }

        // Clear the buffer for the next message
        memset(buffer, 0, sizeof(buffer));

        // Close the client connection (server keeps running)
        close(new_socket);
    }

    // Close the server socket (this will never be reached in this example)
    close(server_fd);
    return 0;
}
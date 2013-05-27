/*
  Peanuts for the codemonkey
  Write code, commit to GitHub, get peanuts
*/

void setup() {    
  Serial.begin(9600);
  pinMode(13, OUTPUT);    
}

void loop() {
  if (Serial.available() > 0) {
    int ki = Serial.read();
    Serial.println(ki);
    digitalWrite(13, HIGH); 
    delay(1000);
    digitalWrite(13, LOW); 
  }
}

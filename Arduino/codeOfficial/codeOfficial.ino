#include <ESP8266WiFi.h>
#include <ArduinoJson.h>
#include <SocketIOClient.h>
#include "DHT.h"

#define DHTPIN D5
#define DHTTYPE DHT11
DHT dht( DHTPIN, DHTTYPE);

SocketIOClient io;

extern String RID;
extern String Rfull;

const char* ssid     = "Phan Dinh Tung";
const char* password = "77777777";

char* host  = "192.168.0.102";
String path = "/control/";
String id   = "59ceb2ab498e6f376c0336b5";

const int in1 = D6, in2 = D7, in3 = D8, out1 = D0, out2 = D1, out3 = D2;
int valout1 = 0, valout2 = 0, valout3 = 0, valin1 = 0, valin2 = 0;
unsigned long previousMillis = 0;
int interval =10000;

WiFiClient client;

void setupPinMode() {
  pinMode(in1, INPUT);
  pinMode(in2, INPUT);
  pinMode(in3, INPUT);
  pinMode(out1, OUTPUT);
  pinMode(out2, OUTPUT);
  pinMode(out3, OUTPUT);

  digitalWrite(out1, !valout1);
  digitalWrite(out2, !valout2);
  digitalWrite(out3, !valout3);
}
void connectToWifi() {
  WiFi.begin(ssid, password);
  int count=0;
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
    count++;
    if (count==120) while(1){;}
  }
  Serial.println("WiFi connected");
  Serial.println(F("Di chi IP cua ESP8266 (Socket Client ESP8266): "));
  Serial.println(WiFi.localIP());
}
void getDataFirst() {
  Serial.println("Alo");
  //  path += id + ".json";
  client.print(String("GET ") + path + id + ".json" + " HTTP/1.1\r\n" +
               "Host: " + host + "\r\n" +
               "Connection: keep-alive\r\n\r\n");
  delay(500);
  String section = "header";
  while (client.available()) {
    String line = client.readStringUntil('\r');
    if (section == "header") {
      if (line == "\n") section = "json";
    }
    else if (section == "json") {
      Serial.println(line);
      String result = line.substring(1);
      int size = result.length() + 1;
      char json[size];
      result.toCharArray(json, size);
      StaticJsonBuffer<200> jsonBuffer;
      JsonObject& json_parsed = jsonBuffer.parseObject(json);

      if (!json_parsed.success())
      {
        Serial.println("Can't read state!!!");
        return;
      }
      valout1 = json_parsed["valout1"];
      digitalWrite(out1, !valout1);
      valout2 = json_parsed["valout2"];
      valout3 = json_parsed["valout3"];
      valin1 = json_parsed["valin1"];
      valin1 = json_parsed["valin2"];

      digitalWrite(out1, !valout1);
      digitalWrite(out2, !valout2);
      digitalWrite(out3, !valout3);

      //===========================================
      if (json_parsed["valout1"] == 1) {
        Serial.println("LED1 ON");
      } else {
        Serial.println("LED1 OFF");
      }
      //============================================
      if (json_parsed["valout2"] == 1) {
        Serial.println("LED2 ON");
      } else {
        Serial.println("LED2 OFF");
      }
      //=============================================
      if (json_parsed["valout3"] == 1) {
        Serial.println("LED3 ON");
      } else {
        Serial.println("LED3 OFF");
      }
    }
  }
}
void connectToHost() {
  Serial.print("connecting to: "); Serial.println(host);
  int count=0;
  while (!client.connect(host, 3000)) {
    Serial.println("connection failed");
    delay(500);
    count++;
    if(count==120) while(1){;}
  }
  getDataFirst();
}
void connectWithSocket() {
  if (!io.connect(host, 3000)) {
    Serial.println(F("Ket noi den socket server that bai!"));
    return;
  }

  if (io.connected()) {
    io.send("connection", "message", "Connected !!!!");
  }
}
void socketToVal(String line) {
  Serial.println(line);
  int size = line.length() + 1;
  char json[size];
  line.toCharArray(json, size);
  StaticJsonBuffer<200> jsonBuffer;
  JsonObject& json_parsed = jsonBuffer.parseObject(json);
  if (!json_parsed.success()) {
    Serial.println("Can't read state!!!");
    return;
  }
  const char* sId;
  int sEquip = 0;
  int sValue = 0;
  sId = json_parsed["id"];
  sEquip = json_parsed["equip"];
  sValue = json_parsed["value"];
  Serial.print("Eq id: ");
  Serial.println(sId);
  Serial.print("My id: ");
  Serial.println(id);
  if(String(sId) == id ){
    if (sEquip==1) {
      valout1= sValue;
      digitalWrite(out1, !valout1);
    }
    if (sEquip==2) {
      valout2= sValue;
      digitalWrite(out2, !valout2);
    }
    if (sEquip==3) {
      valout3= sValue;
      digitalWrite(out3, !valout3);
    }
    Serial.print("equip: ");
    Serial.println(sEquip);
    Serial.print("value: ");
    Serial.println(sValue);
  }
}

void setup() {
  Serial.begin(115200);
  delay(10);
  // Setup pinMode
  setupPinMode();
  // connect esp to wifi, afer that esp connect to host: 192.168.0.102
  Serial.print("Connecting to "); Serial.println(ssid);
  connectToWifi();
  // connect to host and get data for all equip
  connectToHost();
  getDataFirst();
  Serial.println("Connect success");
  // connect esp to server socket
  connectWithSocket();
  // initialize dht 11
  dht.begin();
  Serial.println("Hello, we go to Loop()");
  ESP.wdtFeed();
}

void loop() {
  ESP.wdtDisable();
  if (io.monitor()) {
    if (RID == "equipLoad") {
      socketToVal(Rfull);
    }
  }
  if (!io.connected()) {
    io.reconnect(host, 3000);
  }

  if( millis() - previousMillis > interval){
    previousMillis= millis();
    Serial.println("Connect success");
    // Read humidity
    float h = dht.readHumidity();
    // Read temperature as Celsius (the default)
    float t = dht.readTemperature();
    io.send("uploadSensor", "{ \"name\": \""+id+"\", \"sensor1\": "+String(h)+", \"sensor2\": "+String(t)+" }");
  }

  if (digitalRead(0)==0) {
    digitalWrite(out1, valout1);
    valout1 = !valout1;
    io.send("equipChange", "{ \"id\": \""+id+"\", \"equip\": "+String(1)+", \"value\": "+String(valout1)+" }");
    while (digitalRead(0)==0) {;}
  }
  if (digitalRead(in1)==1) {
    digitalWrite(out1, valout1);
    valout1 = !valout1;
    io.send("equipChange", "{ \"id\": \""+id+"\", \"equip\": "+String(1)+", \"value\": "+String(valout1)+" }");
    while (digitalRead(in1)==1) {;}
  }
  if (digitalRead(in2)==1) {
    digitalWrite(out2, valout2);
    valout2 = !valout2;
    io.send("equipChange", "{ \"id\": \""+id+"\", \"equip\": "+String(2)+", \"value\": "+String(valout2)+" }");
    while (digitalRead(in2)==1) {;}
  }
  if (digitalRead(in3)==1) {
    digitalWrite(out3, valout3);
    valout3 = !valout3;
    io.send("equipChange", "{ \"id\": \""+id+"\", \"equip\": "+String(3)+", \"value\": "+String(valout3)+" }");
    while (digitalRead(in3)==1) {;}
  }
  ESP.wdtEnable(1000);
}

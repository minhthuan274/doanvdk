#include <ESP8266WiFi.h>
#include <ArduinoJson.h>
const char* ssid     = "Phan Dinh Tung";
const char* password = "77777777";

const char* host     = "192.168.0.102";
String path          = "/control/59ceb2ab498e6f376c0336b5.json";

int valout1=0, valout2=0, valout3=0, valin1=0, valin2=0;

void connectToHost(){
  Serial.print("connecting to: "); Serial.println(host);
  WiFiClient client;
  while (!client.connect(host, 3000)) {
    Serial.println("connection failed");
    delay(500);
    return;
  }
  getDataFirst(client);
}

void getDataFirst(WiFiClient client){
  client.print(String("GET ") + path + " HTTP/1.1\r\n" +
                 "Host: " + host + "\r\n" +
                 "Connection: keep-alive\r\n\r\n");
  delay(5000);
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
      valout1= json_parsed["valout1"];
      valout2= json_parsed["valout2"];
      valout3= json_parsed["valout3"];
      valin1= json_parsed["valin1"];
      valin1= json_parsed["valin2"];
      //===========================================
      if (json_parsed["valout1"]== 1)
      {
        Serial.println("LED1 ON");
      }
      else
      {
        Serial.println("LED1 OFF");
      }
      //============================================
      if (json_parsed["valout2"]== 1)
      {
        Serial.println("LED2 ON");
      }
      else
      {
        Serial.println("LED2 OFF");
      }
      //=============================================
      if (json_parsed["valout3"]== 1)
      {
        Serial.println("LED3 ON");
      }
      else
      {
        Serial.println("LED3 OFF");
      }
    }
  }
}

void setup() {
  pinMode(2, OUTPUT);
  Serial.begin(115200);
  delay(10);
  Serial.print("Connecting to "); Serial.println(ssid);
  WiFi.begin(ssid, password);
  int wifi_ctr = 0;
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("WiFi connected");
  connectToHost();
}

void loop() {
  Serial.print("Out1: "); Serial.println(valout1);
  Serial.print("Out2: "); Serial.println(valout2);
  Serial.print("Out3: "); Serial.println(valout3);
  Serial.print("In1: "); Serial.println(valin1);
  Serial.print("In2: "); Serial.println(valin2);
  while(1){}
}


#include <WiFi.h>
#include <PubSubClient.h>
#include <SPI.h>
#include <MFRC522.h>

// Wiring RC522 ke ESP32
#define SS_PIN 5
#define RST_PIN 22

MFRC522 rfid(SS_PIN, RST_PIN);

const char* ssid = "Chill";
const char* password = "zzzzzzz1";

const char* mqttServer = "10.11.211.132";
const int mqttPort = 1883;

WiFiClient espClient;
PubSubClient client(espClient);

String lastUID = "";
bool cardPresent = false;

void callback(char* topic, byte* payload, unsigned int length) {
    String msg;
    for (int i = 0; i < length; i++) msg += (char)payload[i];
    Serial.println("[MQTT] " + msg);
}

void reconnect() {
    while (!client.connected()) {
        Serial.println("Connecting to MQTT...");
        String clientId = "ESP32_PILAH_" + String(random(0xffff), HEX);

        if (client.connect(clientId.c_str())) {
            Serial.println("MQTT Connected!");
            client.subscribe("pilah/rfid/response");
        } else {
            Serial.print("Failed rc=");
            Serial.println(client.state());
            delay(1000);
        }
    }
}

String getUID() {
    String uid = "";
    for (byte i = 0; i < rfid.uid.size; i++) {
        if (rfid.uid.uidByte[i] < 0x10) uid += "0";
        uid += String(rfid.uid.uidByte[i], HEX);
    }
    uid.toUpperCase();
    return uid;
}

void setup() {
    Serial.begin(115200);

    SPI.begin();
    rfid.PCD_Init();

    Serial.println("Connecting WiFi...");
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(300);
        Serial.print(".");
    }

    Serial.println("\nWiFi OK");
    Serial.println(WiFi.localIP());

    client.setServer(mqttServer, mqttPort);
    client.setCallback(callback);
}

void loop() {
    if (!client.connected()) reconnect();
    client.loop();

    if (rfid.PICC_IsNewCardPresent() && rfid.PICC_ReadCardSerial()) {
        String uid = getUID();

        if (uid != lastUID) {
            Serial.println("SCANNED: " + uid);

            String json = "{\"uid\":\"" + uid + "\"}";
            client.publish("pilah/rfid/scan", json.c_str());

            lastUID = uid;
            cardPresent = true;
        }

        rfid.PICC_HaltA();
        rfid.PCD_StopCrypto1();
    }

    if (cardPresent && !rfid.PICC_IsNewCardPresent()) {
        lastUID = "";
        cardPresent = false;
        delay(300);
    }
}

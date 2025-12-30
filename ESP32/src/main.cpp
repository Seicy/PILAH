#include <WiFi.h>
#include <PubSubClient.h>
#include <SPI.h>
#include <MFRC522.h>

// ================== PIN ==================
#define SS_PIN 5
#define RST_PIN 22
#define RELAY_PIN 27 

MFRC522 rfid(SS_PIN, RST_PIN);

// ================== KONFIGURASI LOGIKA ==================
// Sebagian besar modul relay 1-channel adalah ACTIVE LOW
#define SOLENOID_BUKA  LOW
#define SOLENOID_KUNCI HIGH

// ================== WIFI & MQTT =================
const char* ssid = "Chill";
const char* password = "zzzzzzz1";
const char* mqttServer = "10.122.39.132";
const int mqttPort = 1883;

WiFiClient espClient;
PubSubClient client(espClient);

String lastUID = "";
bool cardPresent = false;

// ================== CALLBACK MQTT ==================
void callback(char* topic, byte* payload, unsigned int length) {
    String msg = "";
    for (int i = 0; i < length; i++) {
        msg += (char)payload[i];
    }

    Serial.println("[MQTT RESPONSE] " + msg);

    // === CEK VERIFIKASI BERHASIL ===
    if (msg.indexOf("\"authorized\":true") != -1) {
        Serial.println("VERIFIKASI BERHASIL → MEMBUKA PINTU");

        digitalWrite(RELAY_PIN, SOLENOID_BUKA);  // Beri sinyal LOW untuk mengaktifkan Relay
        delay(3000);                             // Biarkan solenoid terbuka selama 3 detik
        digitalWrite(RELAY_PIN, SOLENOID_KUNCI); // Beri sinyal HIGH untuk mematikan Relay (Kunci kembali)
        
        Serial.println("PINTU TERKUNCI KEMBALI");
    } else {
        Serial.println("VERIFIKASI GAGAL → AKSES DITOLAK");
    }
}

void reconnect() {
    while (!client.connected()) {
        Serial.println("Connecting to MQTT...");
        String clientId = "ESP32_PILAH_" + String(random(0xffff), HEX);
        if (client.connect(clientId.c_str())) {
            Serial.println("MQTT Connected!");
            client.subscribe("pilah/rfid/response");
        } else {
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

// ================== SETUP ==================
void setup() {
    Serial.begin(115200);

    // Langkah krusial: Set pin ke HIGH sebelum OUTPUT agar tidak terbuka saat power menyala
    digitalWrite(RELAY_PIN, SOLENOID_KUNCI); 
    pinMode(RELAY_PIN, OUTPUT);
    digitalWrite(RELAY_PIN, SOLENOID_KUNCI); // Pastikan status tetap terkunci

    SPI.begin();
    rfid.PCD_Init();

    Serial.println("Menyambungkan ke WiFi...");
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(300);
        Serial.print(".");
    }

    Serial.println("\nWiFi Terhubung");
    client.setServer(mqttServer, mqttPort);
    client.setCallback(callback);
}

void loop() {
    if (!client.connected()) reconnect();
    client.loop();

    if (rfid.PICC_IsNewCardPresent() && rfid.PICC_ReadCardSerial()) {
        String uid = getUID();
        if (uid != lastUID) {
            Serial.println("RFID TERDETEKSI: " + uid);
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
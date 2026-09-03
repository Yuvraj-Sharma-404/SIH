/*
 * ============================================================================
 * PS43 — Assisted Citizen Kiosk Hardware Controller
 * Platform: ESP32 (NodeMCU-32S / ESP32-WROOM)
 * 
 * Interfacing:
 * - Button 1: RECORD AUDIO  (GPIO 18)
 * - Button 2: PHOTO SNAPSHOT (GPIO 19)
 * - Button 3: SCAN DOCUMENT  (GPIO 21)
 * - Status LED Blue: Wi-Fi Connected (GPIO 2)
 * - Status LED Green: Uploading / Processing (GPIO 4)
 * - Status Buzzer: Feedback tone (GPIO 5)
 * ============================================================================
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h> // ArduinoJson v6 or v7

// Wi-Fi Credentials
const char* WIFI_SSID = "SIH_KIOSK_AP";
const char* WIFI_PASS = "KioskAccess2026";

// Backend Gateway Endpoint (Update with local laptop IP during live demo)
const char* BACKEND_URL = "http://192.168.1.100:3000/api/kiosk/submit";

// Hardware Pin Definitions
#define BTN_RECORD   18
#define BTN_PHOTO    19
#define BTN_DOCUMENT 21

#define LED_WIFI     2
#define LED_STATUS   4
#define BUZZER       5

const char* KIOSK_DEVICE_ID = "ESP32-WARDHA-NODE-01";
const float KIOSK_LAT = 20.7453;
const float KIOSK_LON = 78.6022;

void setup() {
  Serial.begin(115200);
  Serial.println("\n[PS43 KIOSK] Initializing Assisted Citizen Kiosk Controller...");

  pinMode(BTN_RECORD, INPUT_PULLUP);
  pinMode(BTN_PHOTO, INPUT_PULLUP);
  pinMode(BTN_DOCUMENT, INPUT_PULLUP);

  pinMode(LED_WIFI, OUTPUT);
  pinMode(LED_STATUS, OUTPUT);
  pinMode(BUZZER, OUTPUT);

  digitalWrite(LED_WIFI, LOW);
  digitalWrite(LED_STATUS, LOW);

  // Connect to Wi-Fi
  connectWiFi();
}

void loop() {
  // Check Wi-Fi connection
  if (WiFi.status() != WL_CONNECTED) {
    digitalWrite(LED_WIFI, LOW);
    connectWiFi();
  } else {
    digitalWrite(LED_WIFI, HIGH);
  }

  // Detect Button Press with software debounce
  if (digitalRead(BTN_RECORD) == LOW) {
    triggerBeep(1);
    Serial.println("[ACTION] Physical Button Pressed: RECORD AUDIO");
    submitKioskAction("RECORD", "Citizen recorded voice grievance regarding leaking main drinking water pipeline in Sevagram.");
    delay(2000); // Debounce
  }

  if (digitalRead(BTN_PHOTO) == LOW) {
    triggerBeep(2);
    Serial.println("[ACTION] Physical Button Pressed: CAPTURE PHOTO");
    submitKioskAction("PHOTO", "High-resolution camera snapshot of dangerous cracked bridge abutment.");
    delay(2000);
  }

  if (digitalRead(BTN_DOCUMENT) == LOW) {
    triggerBeep(3);
    Serial.println("[ACTION] Physical Button Pressed: SCAN DOCUMENT");
    submitKioskAction("DOCUMENT", "Citizen scanned official Panchayat resolution for irrigation canal silt clearing.");
    delay(2000);
  }

  delay(50);
}

void connectWiFi() {
  Serial.print("[WiFi] Connecting to: ");
  Serial.println(WIFI_SSID);
  WiFi.begin(WIFI_SSID, WIFI_PASS);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n[WiFi] Connected! IP Address: " + WiFi.localIP().toString());
    digitalWrite(LED_WIFI, HIGH);
  } else {
    Serial.println("\n[WiFi] Connection timeout. Operating in offline edge buffer mode.");
  }
}

void triggerBeep(int count) {
  for (int i = 0; i < count; i++) {
    digitalWrite(BUZZER, HIGH);
    delay(100);
    digitalWrite(BUZZER, LOW);
    delay(100);
  }
}

void submitKioskAction(String action, String sampleText) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[ERROR] Cannot submit: WiFi disconnected");
    return;
  }

  digitalWrite(LED_STATUS, HIGH); // Turn on processing LED
  HTTPClient http;
  http.begin(BACKEND_URL);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("X-Kiosk-Device-ID", KIOSK_DEVICE_ID);

  // Prepare JSON payload
  StaticJsonDocument<512> doc;
  doc["kioskId"] = KIOSK_DEVICE_ID;
  doc["action"] = action;
  doc["transcription"] = sampleText;
  doc["latitude"] = KIOSK_LAT;
  doc["longitude"] = KIOSK_LON;
  doc["reporterName"] = "Gram Panchayat Citizen";

  String requestBody;
  serializeJson(doc, requestBody);

  Serial.println("[HTTP POST] Sending payload to " + String(BACKEND_URL));
  int httpResponseCode = http.POST(requestBody);

  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.print("[HTTP SUCCESS] Code: ");
    Serial.println(httpResponseCode);
    Serial.println("[Response] " + response);
    // Success feedback tone
    triggerBeep(1);
  } else {
    Serial.print("[HTTP ERROR] Failed with code: ");
    Serial.println(httpResponseCode);
  }

  http.end();
  digitalWrite(LED_STATUS, LOW); // Processing complete
}

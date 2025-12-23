import mqtt from "mqtt";

const client = mqtt.connect("ws://127.0.0.1:9001", {
    clientId: "react_dashboard_" + Math.random().toString(16).substr(2, 8),
    clean: true,
});

client.on("connect", () => {
    console.log("MQTT Connected (React)");

    client.subscribe("pilah/rfid/response", { qos: 0 }, (err) => {
        if (!err) console.log("React subscribed to pilah/rfid/response");
    });
});

client.on("message", (topic, msg) => {
    console.log("MQTT MESSAGE RECEIVED:", topic, msg.toString());
});

export default client;

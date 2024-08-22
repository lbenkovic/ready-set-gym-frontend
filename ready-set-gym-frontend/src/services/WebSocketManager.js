import config from "../../config.json";

class WebSocketManager {
    constructor() {
        this.ws = null;
        this.isConnected = false;
        this.messageHandlers = [];
        this.url = config.WEBSOCKET_URL;
        this.shouldReconnect = true; // Control reconnection attempts
    }

    connect(userEmail) {
        if (this.ws) {
            console.log("WebSocket connection already established.");
            return;
        }

        const wsUrlWithParams = `${this.url}${userEmail}`;
        this.ws = new WebSocket(wsUrlWithParams);

        this.ws.onopen = () => {
            this.isConnected = true;
            console.log("WebSocket connection opened.");
            this.ws.send(
                JSON.stringify({ type: "register", email: userEmail })
            );
        };

        this.ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            this.messageHandlers.forEach((handler) => handler(message));
        };

        this.ws.onclose = () => {
            this.isConnected = false;
            console.log("WebSocket connection closed.");
            this.ws = null; // Ensure the ws object is reset

            if (this.shouldReconnect) {
                setTimeout(() => this.connect(userEmail), 5000);
            }
        };

        this.ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };
    }

    sendMessage(message) {
        if (this.ws && this.isConnected) {
            this.ws.send(JSON.stringify(message));
        } else {
            console.error("WebSocket is not connected.");
        }
    }

    onMessage(handler) {
        this.messageHandlers.push(handler);
    }

    close() {
        if (this.ws) {
            this.shouldReconnect = false; // Prevent reconnection on close
            this.ws.close();
            this.ws = null;
            this.isConnected = false; // Ensure state reflects the closed connection
            console.log("WebSocket connection manually closed.");
        }
    }
}

const webSocketManager = new WebSocketManager();
export default webSocketManager;

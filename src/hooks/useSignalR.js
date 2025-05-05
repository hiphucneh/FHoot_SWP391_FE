import { useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";
import axios from "axios";

const useSignalR = ({ baseHubUrl, token, onUpdateGroups, onNextQuestion, onCountAnswer, onEndSession, onShowLeaderBoard }) => {
    const connectionRef = useRef(null);
    const [connectionId, setConnectionId] = useState(null);

    useEffect(() => {
        if (!baseHubUrl || !token) {
            console.error("Missing baseHubUrl or token for SignalR connection.");
            return;
        }

        const negotiate = async () => {
            try {
                const response = await axios.post(`${baseHubUrl}/negotiate`, null, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log("Negotiation success:", response.data);
                setConnectionId(response.data.connectionId);
            } catch (err) {
                console.error("Negotiation failed:", err);
            }
        };

        negotiate();
    }, [baseHubUrl, token]);

    useEffect(() => {
        if (!baseHubUrl || !token || connectionRef.current) return;

        const connection = new signalR.HubConnectionBuilder()
            .withUrl(baseHubUrl, {
                accessTokenFactory: () => token,
                transport: signalR.HttpTransportType.WebSockets,
            })
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Information)
            .build();


        connection.on("playerjoined", (data) => {
            console.log("Player joined:", data);
            if (onUpdateGroups) {
                onUpdateGroups(data);
            }
        });

        connection.on("sessionstarted", (data) => {
            console.log("Session started:", data);
            if (onUpdateGroups) {
                onUpdateGroups(data);
            }
        });

        connection.on("ShowQuestion", (data) => {
            console.log("ShowQuestion nhận được:", data);
            if (onNextQuestion) onNextQuestion(data);
        });

        connection.on("ReceiveLeaderboard", (data) => {
            onShowLeaderBoard(true)
        });

        connection.on("PlayerAnswer", (data) => {
            onCountAnswer();
        });

        connection.on("sessionended", (data) => {
            onEndSession(data);
        });


        connection.start()
            .then(() => {
                console.log("SignalR connected.");
            })
            .catch((err) => {
                console.error("SignalR connection failed:", err);
            });

        connectionRef.current = connection;

        return () => {
            if (connectionRef.current) {
                console.log("Stopping SignalR connection...");
                connectionRef.current.stop();
                connectionRef.current = null;
            }
        };
    }, [baseHubUrl, token, onUpdateGroups]);



    return connectionRef;
};

export default useSignalR;

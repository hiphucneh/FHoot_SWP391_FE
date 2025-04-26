import { useEffect, useRef } from "react";
import * as signalR from "@microsoft/signalr";

const useSignalR = ({ hubUrl, token, onUpdateGroups }) => {
    const connectionRef = useRef(null);

    useEffect(() => {
        if (!hubUrl || !token) {
            console.error("❌ Missing hubUrl or token for SignalR connection.");
            return;
        }

        const connection = new signalR.HubConnectionBuilder()
            .withUrl(hubUrl, {
                accessTokenFactory: () => token,
            })
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Information)
            .build();

        connection.on("UpdateGroups", (updatedGroups) => {
            console.log("📡 Received UpdateGroups:", updatedGroups);
            onUpdateGroups && onUpdateGroups(updatedGroups);
        });

        connection
            .start()
            .then(() => console.log("✅ SignalR connected."))
            .catch((err) => console.error("❌ SignalR connection failed:", err));

        connectionRef.current = connection;

        return () => {
            if (connectionRef.current) {
                console.log("🔌 Stopping SignalR connection...");
                connectionRef.current.stop();
            }
        };
    }, [hubUrl, token, onUpdateGroups]);

    return connectionRef;
};

export default useSignalR;

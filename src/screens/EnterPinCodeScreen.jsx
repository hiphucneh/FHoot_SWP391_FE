import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./EnterPinCodeScreen.module.css";
import BlockJoinGame from "../Host/blockjoingame"; // Import BlockJoinGame dùng lại
import useSignalR from "../hooks/useSignalR"; // Import useSignalR hook
// Assuming your SignalR client library constants are available, e.g., from '@microsoft/signalr'
import * as signalR from "@microsoft/signalr";

export default function EnterPinCodeScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [groups, setGroups] = useState([]); // You might use this later based on hub responses
  const [gamePin, setGamePin] = useState("");
  const [showRoleWarning, setShowRoleWarning] = useState(false);
  const [isJoining, setIsJoining] = useState(false); // State to handle loading/disabling button
  const [joinError, setJoinError] = useState(null); // State to display join errors

  const handleUpdateGroups = useCallback((updatedGroups) => {
    console.log("✅ Update groups:", updatedGroups);
    setGroups(updatedGroups); // setGroups từ useState đã được React đảm bảo ổn định
  }, []); // Mảng dependency rỗng

  // --- SignalR Connection Setup ---
  const connectionRef = useSignalR(
    {
      baseHubUrl:
        "https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/gamehubs",
      token: localStorage.getItem("token"), // Ensure token handling is correct
      onUpdateGroups: handleUpdateGroups, // Callback to handle group updates
      // You might receive updates here *after* joining a session
    }
    // Add handlers for other relevant events from the hub if needed
    // e.g., onJoinSuccess, onJoinError, onGameStarted etc.
  );

  console.log("🔌 SignalR connection Ref:", connectionRef.current); // Log the ref itself

  // --- Effects ---
  useEffect(() => {
    if (location.state?.pin) {
      setGamePin(location.state.pin);
    }

    // Check user role
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        const role = user.role?.toLowerCase();
        if (role === "admin" || role === "teacher") {
          setShowRoleWarning(true);
        }
      } catch (error) {
        console.error("Failed to parse user data:", error);
      }
    }
  }, [location.state]);

  // --- Handlers ---
  const handleBackHome = () => {
    navigate("/Home");
  };

  const handleBack = () => {
    navigate("/");
  };

  const handleJoinGame = async () => {
    if (!gamePin || gamePin.length < 5) {
      setJoinError("Please enter a valid Game PIN.");
      return;
    }
    if (isJoining) return;

    const connection = connectionRef.current;
    if (
      !connection ||
      connection.state !== signalR.HubConnectionState.Connected
    ) {
      console.error("SignalR Connection not established or not connected.");
      setJoinError("Connection error. Please try again.");
      return;
    }

    setIsJoining(true);
    setJoinError(null);

    try {
      console.log(`Attempting to join session with PIN: ${gamePin}`);

      await connection.invoke("JoinSession", gamePin);

      localStorage.setItem("sessionCode", gamePin);

      console.log(`Successfully invoked JoinSession for PIN: ${gamePin}`);

      navigate("/choose-group", { state: { pin: gamePin } });
    } catch (err) {
      console.error("Failed to join session:", err);
      setJoinError(
        `Failed to join: ${
          err.message || "Unknown error"
        }. Please check the PIN and try again.`
      );
    } finally {
      setIsJoining(false);
    }
  };

  // --- Render ---
  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={handleBack}>
        ← Back
      </button>

      <div className={`${styles.formBox} ${styles.fadeIn}`}>
        <h1 className={styles.title}>Enter Game PIN</h1>
        <input
          type="text"
          placeholder="Game PIN"
          value={gamePin}
          onChange={(e) => {
            const value = e.target.value;
            const numericValue = value.replace(/\D/g, ""); // Allow only digits
            if (numericValue.length <= 10) {
              // Max length check
              setGamePin(numericValue);
              setJoinError(null); // Clear error on input change
            }
          }}
          className={styles.inputField}
          disabled={isJoining} // Disable input while joining
        />
        {/* Display Join Error */}
        {joinError && <p className={styles.errorText}>{joinError}</p>}

        {/* Attach handler and disable button while joining */}
        <button
          className={styles.joinButton}
          onClick={handleJoinGame}
          disabled={isJoining || !gamePin} // Disable if joining or no PIN entered
        >
          {isJoining ? "Joining..." : "Join"}
        </button>
      </div>

      {/* Footer */}
      <div className={`${styles.footer} ${styles.fadeIn}`}>
        {/* ... footer content ... */}
        <p>
          Create your own kahoot for FREE at{" "}
          <a
            href="https://kahoot.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            kahoot.com
          </a>
        </p>
        <div className={styles.footerLinks}>
          <a href="#">Terms</a> | <a href="#">Privacy</a> |{" "}
          <a href="#">Cookie notice</a>
        </div>
      </div>

      {/* Role Warning Modal */}
      <BlockJoinGame
        show={showRoleWarning}
        onClose={handleBackHome}
        title="Access Restricted"
        message="🚫 This area is only for Students to join live games."
        buttonText="Back to Home"
      />
    </div>
  );
}

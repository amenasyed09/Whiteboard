import { useState } from "react";
import React from "react";

export default function RoomSelection({ onJoinRoom }) {
  const [roomId, setRoomId] = useState("");
  const [showJoinInput, setShowJoinInput] = useState(false);

  const generateRoomId = () => {
    return `room-${Math.random().toString(36).substring(2, 9)}`;
  };

  const handleCreateRoom = () => {
    const newRoomId = generateRoomId();
    onJoinRoom(newRoomId);
  };

  const handleJoinRoom = () => {
    if (roomId.trim()) {
      onJoinRoom(roomId.trim());
    }
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      backgroundColor: "#f5f5f5",
      padding: "20px"
    }}>
      <div style={{
        backgroundColor: "white",
        borderRadius: "16px",
        padding: "40px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        maxWidth: "500px",
        width: "100%"
      }}>
        <h1 style={{
          textAlign: "center",
          color: "#333",
          marginBottom: "10px",
          fontSize: "28px"
        }}>
          Collaborative Whiteboard
        </h1>
        <p style={{
          textAlign: "center",
          color: "#666",
          marginBottom: "40px",
          fontSize: "14px"
        }}>
          Create a new room or join an existing one
        </p>

        {!showJoinInput ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <button
              onClick={handleCreateRoom}
              style={{
                padding: "16px 24px",
                backgroundColor: "#ffc0cb",
                border: "2px solid #ffb6c1",
                borderRadius: "12px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "16px",
                color: "#333",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = "#ffb6c1"}
              onMouseLeave={(e) => e.target.style.backgroundColor = "#ffc0cb"}
            >
              🎨 Create New Room
            </button>

            <button
              onClick={() => setShowJoinInput(true)}
              style={{
                padding: "16px 24px",
                backgroundColor: "white",
                border: "2px solid #ffc0cb",
                borderRadius: "12px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "16px",
                color: "#333",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = "#fff5f7"}
              onMouseLeave={(e) => e.target.style.backgroundColor = "white"}
            >
              🚪 Join Existing Room
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter Room ID"
              style={{
                padding: "16px",
                border: "2px solid #e0e0e0",
                borderRadius: "12px",
                fontSize: "16px",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => e.target.style.borderColor = "#ffc0cb"}
              onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
              onKeyPress={(e) => e.key === "Enter" && handleJoinRoom()}
            />

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={handleJoinRoom}
                disabled={!roomId.trim()}
                style={{
                  flex: 1,
                  padding: "16px 24px",
                  backgroundColor: roomId.trim() ? "#ffc0cb" : "#e0e0e0",
                  border: "2px solid " + (roomId.trim() ? "#ffb6c1" : "#ccc"),
                  borderRadius: "12px",
                  cursor: roomId.trim() ? "pointer" : "not-allowed",
                  fontWeight: "bold",
                  fontSize: "16px",
                  color: "#333",
                  transition: "all 0.2s",
                }}
              >
                Join Room
              </button>

              <button
                onClick={() => {
                  setShowJoinInput(false);
                  setRoomId("");
                }}
                style={{
                  flex: 1,
                  padding: "16px 24px",
                  backgroundColor: "white",
                  border: "2px solid #e0e0e0",
                  borderRadius: "12px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "16px",
                  color: "#666",
                  transition: "all 0.2s",
                }}
              >
                Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
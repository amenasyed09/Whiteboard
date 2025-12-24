import { useEffect, useState } from "react";
import Login from "./login";
import Register from "./register";
import Whiteboard from "./whiteboard";
import RoomSelection from "./roomselection";
import React from "react";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [page, setPage] = useState("login"); // login | register | room-select | board
  const [currentRoom, setCurrentRoom] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setIsAuthenticated(true);
      setPage("room-select");
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setPage("room-select");
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsAuthenticated(false);
    setPage("login");
    setCurrentRoom(null);
  };

  const handleJoinRoom = (roomId) => {
    setCurrentRoom(roomId);
    setPage("board");
  };

  const handleLeaveRoom = () => {
    setCurrentRoom(null);
    setPage("room-select");
  };

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <h2>🐱 KittyBoard</h2>
        {isAuthenticated && (
          <div style={{ display: "flex", gap: "10px" }}>
            {page === "board" && (
              <button onClick={handleLeaveRoom} style={styles.leaveRoom}>
                Leave Room
              </button>
            )}
            <button onClick={handleLogout} style={styles.logout}>
              Logout
            </button>
          </div>
        )}
      </header>

      <main style={styles.main}>
        {!isAuthenticated && page === "login" && (
          <Login
            onSuccess={handleLoginSuccess}
            onSwitch={() => setPage("register")}
          />
        )}

        {!isAuthenticated && page === "register" && (
          <Register onSwitch={() => setPage("login")} />
        )}

        {isAuthenticated && page === "room-select" && (
          <RoomSelection onJoinRoom={handleJoinRoom} />
        )}

        {isAuthenticated && page === "board" && currentRoom && (
          <Whiteboard roomId={currentRoom} />
        )}
      </main>
    </div>
  );
}

export default App;

const styles = {
  app: {
    minHeight: "100vh",
    background: "#fff7fb",
    fontFamily: "sans-serif",
  },
  header: {
    padding: "12px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#ffb6c1",
  },
  logout: {
    background: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  leaveRoom: {
    background: "#ff6b6b",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    color: "white",
    fontWeight: "bold",
  },
  main: {
    padding: "20px",
    display: "flex",
    justifyContent: "center",
  },
};
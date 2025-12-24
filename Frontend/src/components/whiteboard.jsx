import { useEffect, useRef, useState } from "react";
import { connectSocket } from "../connection/socket";
import React from "react";

export default function Whiteboard({ roomId }) {
  const canvasRef = useRef(null);
  const socketRef = useRef(null);
  const drawing = useRef(false);
  const prevPos = useRef({ x: 0, y: 0 });
  const [usersInRoom, setUsersInRoom] = useState([]);
  const [currentColor, setCurrentColor] = useState("purple");
  const [isEraser, setIsEraser] = useState(false);
  const [currentDrawer, setCurrentDrawer] = useState("");
  const drawerTimeoutRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const colors = ["purple", "black", "blue"];

  // Helper function to draw a line on canvas
  const drawLine = (ctx, data) => {
    ctx.globalCompositeOperation = data.isEraser ? "destination-out" : "source-over";
    ctx.strokeStyle = data.color;
    ctx.lineWidth = data.isEraser ? 20 : 2;
    ctx.beginPath();
    ctx.moveTo(data.x0, data.y0);
    ctx.lineTo(data.x1, data.y1);
    ctx.stroke();
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    
    // Connect socket
    socketRef.current = connectSocket(token);

    // Join the room with the provided roomId
    socketRef.current.emit("join-room", roomId);

    const ctx = canvasRef.current.getContext("2d");
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = currentColor;

    // Listen for initial room users list
    socketRef.current.on("room-users", ({ users }) => {
      setUsersInRoom(users.filter((u) => u !== socketRef.current.user?.name));
    });

    // Listen for existing canvas state when joining
    socketRef.current.on("canvas-state", ({ drawings }) => {
      console.log("Received canvas state:", drawings.length, "drawings");
      // Redraw all existing drawings
      drawings.forEach((data) => {
        drawLine(ctx, data);
      });
    });

    // Listen for drawing events from other users
    socketRef.current.on("draw", ({ data, user }) => {
      // Show who is drawing
      setCurrentDrawer(user);
      if (drawerTimeoutRef.current) {
        clearTimeout(drawerTimeoutRef.current);
      }
      drawerTimeoutRef.current = setTimeout(() => {
        setCurrentDrawer("");
      }, 1000);

      drawLine(ctx, data);
    });

    // Listen for clear canvas event
    socketRef.current.on("clear-canvas", () => {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    });

    // Listen for users joining
    socketRef.current.on("user-joined", ({ user }) => {
      setUsersInRoom((prev) => {
        if (prev.includes(user)) return prev;
        return [...prev, user];
      });
    });

    // Listen for users leaving
    socketRef.current.on("user-left", ({ user }) => {
      setUsersInRoom((prev) => prev.filter((u) => u !== user));
    });

    // Clean up on unmount
    return () => {
      if (drawerTimeoutRef.current) {
        clearTimeout(drawerTimeoutRef.current);
      }
      socketRef.current.disconnect();
    };
  }, [roomId]);

  const draw = (e) => {
    if (!drawing.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const data = {
      x0: prevPos.current.x,
      y0: prevPos.current.y,
      x1: x,
      y1: y,
      color: currentColor,
      isEraser: isEraser,
    };

    // Update canvas locally
    const ctx = canvasRef.current.getContext("2d");
    drawLine(ctx, data);

    // Send to other users
    socketRef.current.emit("draw", { roomId, data });

    prevPos.current = { x, y };
  };

  const clearCanvas = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    // Notify server and other users to clear canvas
    socketRef.current.emit("clear-canvas", { roomId });
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", padding: "20px" }}>
      <div style={{ textAlign: "center" }}>
        <h2 style={{ margin: 0, color: "#333" }}>Collaborative Whiteboard</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "10px", justifyContent: "center" }}>
          <span style={{ fontSize: "14px", color: "#666" }}>Room ID: <strong>{roomId}</strong></span>
          <button
            onClick={copyRoomId}
            style={{
              padding: "6px 12px",
              backgroundColor: copied ? "#90EE90" : "#ffc0cb",
              border: "2px solid " + (copied ? "#7CCD7C" : "#ffb6c1"),
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: "bold",
              color: "#333",
            }}
          >
            {copied ? "✓ Copied!" : "Copy ID"}
          </button>
        </div>
      </div>
      
      <div style={{ display: "flex", gap: "15px", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <span style={{ fontWeight: "bold" }}>Colors:</span>
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => {
                setCurrentColor(color);
                setIsEraser(false);
              }}
              style={{
                width: "40px",
                height: "40px",
                backgroundColor: color,
                border: currentColor === color && !isEraser ? "3px solid #ffc0cb" : "2px solid #ccc",
                borderRadius: "50%",
                cursor: "pointer",
                boxShadow: currentColor === color && !isEraser ? "0 0 10px rgba(255, 192, 203, 0.5)" : "none",
              }}
              title={color}
            />
          ))}
        </div>

        <button
          onClick={() => setIsEraser(!isEraser)}
          style={{
            padding: "10px 20px",
            backgroundColor: isEraser ? "#ff6b6b" : "#f0f0f0",
            border: "2px solid #ccc",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            color: isEraser ? "white" : "#333",
          }}
        >
          {isEraser ? "✓ Eraser" : "Eraser"}
        </button>

        <button
          onClick={clearCanvas}
          style={{
            padding: "10px 20px",
            backgroundColor: "#ffc0cb",
            border: "2px solid #ffb6c1",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            color: "#333",
          }}
        >
          Clear Canvas
        </button>
      </div>

      <div style={{ display: "flex", gap: "20px", alignItems: "flex-start", fontSize: "14px" }}>
        <div>
          <strong>Users in Room:</strong> {usersInRoom.length > 0 ? usersInRoom.join(", ") : "Just you"}
        </div>
        {currentDrawer && (
          <div style={{ color: "#ff6b9d", fontWeight: "bold" }}>
            ✏️ {currentDrawer} is drawing...
          </div>
        )}
      </div>

      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        onMouseDown={(e) => {
          drawing.current = true;
          const rect = canvasRef.current.getBoundingClientRect();
          prevPos.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          };
        }}
        onMouseUp={() => (drawing.current = false)}
        onMouseLeave={() => (drawing.current = false)}
        onMouseMove={draw}
        style={{
          border: "2px solid pink",
          cursor: isEraser ? "not-allowed" : "crosshair",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      />
    </div>
  );
}
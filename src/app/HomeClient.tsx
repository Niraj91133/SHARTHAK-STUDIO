"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Directly import the heavy content but don't render it until mounted
import AppContent from "./AppContent";

export default function HomeClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Simple, fail-safe loading state that doesn't rely on complex CSS/animations
  if (!isClient) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "black",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontFamily: "sans-serif"
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "3px solid rgba(255,255,255,0.3)",
              borderTop: "3px solid white",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 20px"
            }}
          />
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
          <p style={{ letterSpacing: "0.2em", fontSize: "12px", opacity: 0.6 }}>SHARTHAK STUDIO</p>
        </div>
      </div>
    );
  }

  return <AppContent />;
}

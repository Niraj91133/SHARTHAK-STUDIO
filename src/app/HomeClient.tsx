"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Extremely aggressive lazy loading to stop any hydration mismatch loops
const App = dynamic(() => import("@/app/AppContent"), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
  </div>
});

export default function HomeClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className="min-h-screen bg-black" />;
  }

  return <App />;
}

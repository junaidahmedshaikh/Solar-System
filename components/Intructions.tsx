import React from "react";
import { Card, CardContent } from "./ui/card";

export default function Intructions() {
  return (
    <Card className="bg-black/70 text-white border-gray-600/50 backdrop-blur-md">
      <CardContent className="p-4">
        <div className="text-sm space-y-2 text-gray-300">
          <div className="flex items-center gap-2">
            <span>🖱️</span>
            <span>Drag to rotate • Scroll to zoom</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🪐</span>
            <span>Click planets for details</span>
          </div>
          <div className="flex items-center gap-2">
            <span>⚡</span>
            <span>Adjust orbital speeds</span>
          </div>
          <div className="flex items-center gap-2">
            <span>⏰</span>
            <span>Control time scale</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🌌</span>
            <span>Realistic physics &amp; lighting</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

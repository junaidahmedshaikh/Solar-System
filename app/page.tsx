"use client";

import { useRef, useState, useCallback, Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RotateCcw, Info, Maximize } from "lucide-react";
import Intructions from "@/components/Intructions";
import { planetData } from "@/constant";
import SolarSystem from "@/components/SolarSystem";

export default function Component() {
  const [planetSpeeds, setPlanetSpeeds] = useState<number[]>(() =>
    planetData.map(() => 1)
  );
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredPlanet, setHoveredPlanet] = useState<
    (typeof planetData)[0] | null
  >(null);
  const [selectedPlanet, setSelectedPlanet] = useState<
    (typeof planetData)[0] | null
  >(null);
  const [showControls, setShowControls] = useState(true);
  const [timeScale, setTimeScale] = useState(0.1);
  const [showInfo, setShowInfo] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleSpeedChange = useCallback(
    (planetIndex: number, newSpeed: number[]) => {
      if (newSpeed && newSpeed.length > 0 && typeof newSpeed[0] === "number") {
        setPlanetSpeeds((prev) => {
          const newSpeeds = [...prev];
          newSpeeds[planetIndex] = newSpeed[0];
          return newSpeeds;
        });
      }
    },
    []
  );

  const resetSpeeds = useCallback(() => {
    setPlanetSpeeds(planetData.map(() => 1));
  }, []);

  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  }, []);

  const handleTimeScaleChange = useCallback((value: number[]) => {
    if (value && value.length > 0 && typeof value[0] === "number") {
      setTimeScale(value[0]);
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  return (
    <div className="w-full h-screen relative bg-black overflow-hidden">
      <Canvas
        camera={{ position: [60, 40, 60], fov: 45 }}
        className="w-full h-full"
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
      >
        <Suspense fallback={null}>
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={20}
            maxDistance={300}
            maxPolarAngle={Math.PI}
            enableDamping={true}
            dampingFactor={0.05}
          />
          <SolarSystem
            planetSpeeds={planetSpeeds}
            isPaused={isPaused}
            hoveredPlanet={hoveredPlanet}
            setHoveredPlanet={setHoveredPlanet}
            selectedPlanet={selectedPlanet}
            setSelectedPlanet={setSelectedPlanet}
            timeScale={timeScale}
          />
        </Suspense>
      </Canvas>

      {/* Header */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl md:text-4xl font-bold text-white drop-shadow-2xl">
            🌌 Realistic Solar System
          </h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFullscreen}
              className="bg-black/60 text-white border-gray-600 hover:bg-gray-800/80 backdrop-blur-sm"
            >
              <Maximize className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowInfo(!showInfo)}
              className="bg-black/60 text-white border-gray-600 hover:bg-gray-800/80 backdrop-blur-sm"
            >
              <Info className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowControls(!showControls)}
              className="bg-black/60 text-white border-gray-600 hover:bg-gray-800/80 backdrop-blur-sm"
            >
              Controls
            </Button>
          </div>
        </div>
      </div>

      {/* Planet Info Display */}
      {(hoveredPlanet || selectedPlanet) && (
        <div className="absolute top-20 left-4 z-10">
          <Card className="w-96 bg-black/80 text-white border-blue-500/30 backdrop-blur-md">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3">
                <div
                  className="w-6 h-6 rounded-full border-2 border-white/50 shadow-lg"
                  style={{
                    backgroundColor: (hoveredPlanet || selectedPlanet)?.color,
                    boxShadow: `0 0 10px ${
                      (hoveredPlanet || selectedPlanet)?.color
                    }50`,
                  }}
                />
                <span className="text-xl">
                  {(hoveredPlanet || selectedPlanet)?.name}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-blue-200">
                {(hoveredPlanet || selectedPlanet)?.info}
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-gray-900/70 p-3 rounded-lg border border-gray-700">
                  <div className="text-gray-400 mb-1">Size (Earth = 1)</div>
                  <div className="font-mono text-lg text-white">
                    {(hoveredPlanet || selectedPlanet)?.size.toFixed(2)}
                  </div>
                </div>
                <div className="bg-gray-900/70 p-3 rounded-lg border border-gray-700">
                  <div className="text-gray-400 mb-1">Distance (AU)</div>
                  <div className="font-mono text-lg text-white">
                    {(
                      ((hoveredPlanet || selectedPlanet)?.distance || 0) / 10
                    ).toFixed(1)}
                  </div>
                </div>
                <div className="bg-gray-900/70 p-3 rounded-lg border border-gray-700">
                  <div className="text-gray-400 mb-1">Orbital Period</div>
                  <div className="font-mono text-lg text-white">
                    {(hoveredPlanet || selectedPlanet)?.orbitalPeriod} days
                  </div>
                </div>
                <div className="bg-gray-900/70 p-3 rounded-lg border border-gray-700">
                  <div className="text-gray-400 mb-1">Day Length</div>
                  <div className="font-mono text-lg text-white">
                    {Math.abs(
                      (hoveredPlanet || selectedPlanet)?.rotationPeriod || 0
                    ).toFixed(1)}{" "}
                    days
                  </div>
                </div>
              </div>

              {showInfo && (
                <div className="space-y-3">
                  <div className="text-sm font-medium text-blue-300">
                    Fascinating Facts:
                  </div>
                  <ul className="text-sm space-y-2 text-gray-300">
                    {(hoveredPlanet || selectedPlanet)?.facts.map(
                      (fact, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="text-blue-400 mt-1 text-lg">•</span>
                          <span>{fact}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Control Panel */}
      {showControls && (
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <Card className="bg-black/80 text-white border-gray-600/50 backdrop-blur-md">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">Mission Control</CardTitle>
                <div className="flex gap-3 items-center">
                  <div className="text-sm text-gray-300">
                    Time Scale: {timeScale.toFixed(2)}x
                  </div>
                  <Slider
                    value={[timeScale]}
                    onValueChange={handleTimeScaleChange}
                    max={2}
                    min={0.01}
                    step={0.01}
                    className="w-24"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetSpeeds}
                    className="bg-gray-800/80 text-white border-gray-600 hover:bg-gray-700/80"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                  <Button
                    variant={isPaused ? "default" : "outline"}
                    size="sm"
                    onClick={togglePause}
                    className={
                      !isPaused
                        ? "bg-gray-800/80 text-white border-gray-600 hover:bg-gray-700/80"
                        : "bg-blue-600 hover:bg-blue-700"
                    }
                  >
                    {isPaused ? (
                      <Play className="w-4 h-4" />
                    ) : (
                      <Pause className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {planetData.map((planet, index) => (
                  <div key={planet.name} className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full border border-white/50 shadow-lg"
                        style={{
                          backgroundColor: planet.color,
                          boxShadow: `0 0 8px ${planet.color}50`,
                        }}
                      />
                      <span className="text-sm font-medium">{planet.name}</span>
                      <Badge
                        variant="secondary"
                        className="text-xs bg-gray-700/80 text-gray-200"
                      >
                        {(planetSpeeds[index] || 1).toFixed(1)}x
                      </Badge>
                    </div>
                    <Slider
                      value={[planetSpeeds[index] || 1]}
                      onValueChange={(value) => handleSpeedChange(index, value)}
                      max={10}
                      min={0}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Instructions */}
      <div className="absolute top-16 right-4 z-10 max-w-xs">
        <Intructions />
      </div>
    </div>
  );
}

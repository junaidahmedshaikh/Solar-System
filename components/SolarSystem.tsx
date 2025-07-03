import { useCallback } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { planetData } from "@/constant";
import SpaceBackground from "./SpaceBackground";
import StarField from "./StarField";
import RealisticSun from "./RealisticSun";
import RealisticPlanet from "./RealisticPlanet";

export default function SolarSystem({
  planetSpeeds,
  isPaused,
  hoveredPlanet,
  setHoveredPlanet,
  selectedPlanet,
  setSelectedPlanet,
  timeScale,
}: {
  planetSpeeds: number[];
  isPaused: boolean;
  hoveredPlanet: (typeof planetData)[0] | null;
  setHoveredPlanet: (planet: (typeof planetData)[0] | null) => void;
  selectedPlanet: (typeof planetData)[0] | null;
  setSelectedPlanet: (planet: (typeof planetData)[0] | null) => void;
  timeScale: number;
}) {
  const { camera } = useThree();

  const handlePlanetClick = useCallback(
    (planet: (typeof planetData)[0]) => {
      setSelectedPlanet(planet === selectedPlanet ? null : planet);

      if (planet !== selectedPlanet) {
        const targetPosition = new THREE.Vector3(
          planet.distance * 1.5,
          planet.distance * 0.4,
          planet.distance * 1.5
        );

        const startPosition = camera.position.clone();
        const startTime = Date.now();
        const duration = 2000;

        const animateCamera = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);

          camera.position.lerpVectors(startPosition, targetPosition, eased);
          camera.lookAt(0, 0, 0);

          if (progress < 1) {
            requestAnimationFrame(animateCamera);
          }
        };

        animateCamera();
      }
    },
    [camera, selectedPlanet, setSelectedPlanet]
  );

  return (
    <>
      <SpaceBackground />
      <StarField />
      <RealisticSun />
      {planetData.map((planet, index) => (
        <RealisticPlanet
          key={planet.name}
          data={planet}
          speedMultiplier={planetSpeeds[index] || 1}
          isPaused={isPaused}
          onHover={setHoveredPlanet}
          onLeave={() => setHoveredPlanet(null)}
          onClick={handlePlanetClick}
          isSelected={selectedPlanet?.name === planet.name}
          timeScale={timeScale}
        />
      ))}
    </>
  );
}

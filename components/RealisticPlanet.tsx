import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { planetData } from "@/constant";
import SaturnRings from "./SaturnRings";

export default function RealisticPlanet({
  data,
  speedMultiplier,
  isPaused,
  onHover,
  onLeave,
  onClick,
  isSelected,
  timeScale,
}: {
  data: (typeof planetData)[0];
  speedMultiplier: number;
  isPaused: boolean;
  onHover: (planet: (typeof planetData)[0]) => void;
  onLeave: () => void;
  onClick: (planet: (typeof planetData)[0]) => void;
  isSelected: boolean;
  timeScale: number;
}) {
  const planetRef = useRef<THREE.Mesh>(null);
  const orbitRef = useRef<THREE.Group>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);

  const angle = useRef(Math.random() * Math.PI * 2);
  const rotationAngle = useRef(0);

  useFrame((state, delta) => {
    if (!isPaused && orbitRef.current) {
      const orbitalSpeed =
        ((2 * Math.PI) / (data.orbitalPeriod * timeScale)) * speedMultiplier;
      angle.current += orbitalSpeed * delta;

      // Elliptical orbit calculation
      const a = data.distance;
      const e = data.eccentricity;
      const x = a * (Math.cos(angle.current) - e);
      const z = a * Math.sqrt(1 - e * e) * Math.sin(angle.current);

      orbitRef.current.position.set(x, 0, z);
      orbitRef.current.rotation.x = (data.inclination * Math.PI) / 180;
    }

    // Planet rotation
    if (planetRef.current && !isPaused) {
      const rotationSpeed =
        (2 * Math.PI) / (Math.abs(data.rotationPeriod) * timeScale);
      rotationAngle.current +=
        rotationSpeed * delta * (data.rotationPeriod > 0 ? 1 : -1);
      planetRef.current.rotation.y = rotationAngle.current;
    }

    // Atmosphere animation for gas giants
    if (
      atmosphereRef.current &&
      (data.name === "Jupiter" ||
        data.name === "Saturn" ||
        data.name === "Uranus" ||
        data.name === "Neptune")
    ) {
      atmosphereRef.current.rotation.y += 0.005;
      const material = atmosphereRef.current
        .material as THREE.MeshBasicMaterial;
      if (material) {
        material.opacity =
          0.1 + Math.sin(state.clock.elapsedTime + angle.current) * 0.05;
      }
    }
  });

  return (
    <>
      {/* Orbital path */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry
          args={[data.distance - 0.05, data.distance + 0.05, 128]}
        />
        <meshBasicMaterial
          color="#444444"
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      <group ref={orbitRef}>
        <mesh
          ref={planetRef}
          onPointerOver={() => onHover(data)}
          onPointerOut={onLeave}
          onClick={() => onClick(data)}
          scale={isSelected ? 1.4 : 1}
        >
          <sphereGeometry args={[data.size, 32, 32]} />
          <meshStandardMaterial
            color={data.color}
            emissive={data.emissive}
            emissiveIntensity={0.1}
            roughness={0.8}
            metalness={0.1}
          />

          {isSelected && (
            <Html distanceFactor={15}>
              <div className="bg-black/95 text-white px-4 py-3 rounded-xl text-sm whitespace-nowrap border border-blue-500/50 backdrop-blur-sm">
                <div className="font-bold text-lg">{data.name}</div>
                <div className="text-xs opacity-80 mt-1">{data.info}</div>
              </div>
            </Html>
          )}
        </mesh>

        {/* Atmosphere for gas giants */}
        {(data.name === "Jupiter" ||
          data.name === "Saturn" ||
          data.name === "Uranus" ||
          data.name === "Neptune") && (
          <mesh ref={atmosphereRef}>
            <sphereGeometry args={[data.size * 1.08, 32, 32]} />
            <meshBasicMaterial
              color={data.color}
              transparent
              opacity={0.15}
              side={THREE.BackSide}
            />
          </mesh>
        )}

        {/* Earth's atmosphere */}
        {data.name === "Earth" && (
          <mesh>
            <sphereGeometry args={[data.size * 1.05, 32, 32]} />
            <meshBasicMaterial
              color="#87CEEB"
              transparent
              opacity={0.1}
              side={THREE.BackSide}
            />
          </mesh>
        )}

        {/* Saturn's rings */}
        {data.name === "Saturn" && <SaturnRings radius={data.size} />}
      </group>
    </>
  );
}

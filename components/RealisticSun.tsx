import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function RealisticSun() {
  const sunRef = useRef<THREE.Mesh>(null);
  const coronaRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (sunRef.current) {
      sunRef.current.rotation.y += 0.002;
    }
    if (coronaRef.current) {
      coronaRef.current.rotation.y -= 0.001;
      const material = coronaRef.current.material as THREE.MeshBasicMaterial;
      if (material) {
        material.opacity = 0.1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      }
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(
        1 + Math.sin(state.clock.elapsedTime * 3) * 0.1
      );
    }
  });

  return (
    <group>
      {/* Main Sun body */}
      <mesh ref={sunRef}>
        <sphereGeometry args={[4, 64, 64]} />
        <meshBasicMaterial color="#FDB813" />
      </mesh>

      {/* Sun's corona effect */}
      <mesh ref={coronaRef}>
        <sphereGeometry args={[4.5, 32, 32]} />
        <meshBasicMaterial
          color="#FFA500"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Sun's outer glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[5.5, 16, 16]} />
        <meshBasicMaterial
          color="#FFFF00"
          transparent
          opacity={0.05}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Lighting */}
      <directionalLight intensity={3} position={[0, 0, 0]} color="#FFFFFF" />
      <pointLight intensity={2} distance={200} decay={0.5} color="#FFF8DC" />
      <ambientLight intensity={0.15} color="#FFF8DC" />
    </group>
  );
}

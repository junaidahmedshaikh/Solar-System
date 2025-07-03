import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function SaturnRings({ radius }: { radius: number }) {
  const ringsRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (ringsRef.current) {
      ringsRef.current.rotation.z += 0.0005;
    }
  });

  return (
    <group>
      <mesh ref={ringsRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius * 1.2, radius * 2.2, 64]} />
        <meshStandardMaterial
          color="#C4A484"
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

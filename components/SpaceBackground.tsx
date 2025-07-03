import * as THREE from "three";

export default function SpaceBackground() {
  return (
    <mesh>
      <sphereGeometry args={[500, 64, 64]} />
      <meshBasicMaterial
        color="#000011"
        side={THREE.BackSide}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}

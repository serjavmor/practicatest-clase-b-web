import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

function InfiniteGrid() {
  const gridRef = useRef();

  useFrame((state, delta) => {
    if (gridRef.current) {
      gridRef.current.position.z += delta * 2.5; // Speed of the road
      // Reset position to create infinite loop
      // Size 80, divisions 80 -> each square is 1 unit
      if (gridRef.current.position.z > 1) {
        gridRef.current.position.z = 0;
      }
    }
  });

  return (
    <gridHelper 
      ref={gridRef} 
      args={[80, 80, '#ff4ea0', '#c6b5cc']} 
      position={[0, -2.5, 0]} 
    />
  );
}

function KuromiModel() {
  const { scene } = useGLTF('/models/kuromi.glb');
  const meshRef = useRef();
  const [spinCount, setSpinCount] = useState(0);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating and looking around higher up
      const pulseSpeed = hovered ? 3.0 : 1.5;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * pulseSpeed) * 0.3 + 2;
      
      // Rotation logic
      const idleRotationY = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      const targetRotationY = spinCount * Math.PI * 2 + idleRotationY;
      meshRef.current.rotation.y += (targetRotationY - meshRef.current.rotation.y) * 0.1;
      
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
      
      // Smooth scale on hover
      const targetScale = hovered ? 1.3 : 1.125;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.2);
    }
  });

  return (
    <group 
      ref={meshRef} 
      position={[0, 2, -2]}
      scale={[1.125, 1.125, 1.125]}
      onClick={(e) => {
        e.stopPropagation();
        setSpinCount(s => s + 1);
      }}
      onPointerOver={() => {
        document.body.style.cursor = 'pointer';
        setHovered(true);
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
        setHovered(false);
      }}
    >
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload('/models/kuromi.glb');

export default function Scene3D() {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '75vh', zIndex: 0, overflow: 'hidden' }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }} dpr={[1, 2]}>
        <color attach="background" args={['#f9efff']} />
        <fog attach="fog" args={['#f9efff', 5, 20]} />
        
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-10, -10, -5]} intensity={1} color="#ff00ff" />
        
        <InfiniteGrid />
        <KuromiModel />
      </Canvas>
    </div>
  );
}

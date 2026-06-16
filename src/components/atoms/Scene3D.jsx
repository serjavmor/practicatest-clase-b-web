import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

function FloatingParticles({ count = 50 }) {
  const mesh = useRef();
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 25;
      const y = (Math.random() - 0.5) * 35;
      const z = (Math.random() - 0.5) * 15 - 5;
      const s = Math.random() * 0.4 + 0.1;
      const speed = Math.random() * 0.02 + 0.005;
      
      const color = new THREE.Color();
      const randTheme = Math.random();
      if (randTheme > 0.8) {
        color.setHex(0x222222); // Dark grey/black for Kuromi contrast
      } else if (randTheme > 0.5) {
        color.setHex(0xffb300); // Yellow/gold from our buttons
      } else {
        color.setHex(0xff66cc); // Kuromi pink/purple
      }

      temp.push({ position: new THREE.Vector3(x, y, z), scale: s, speed, color, time: Math.random() * 100 });
    }
    return temp;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  // Create color buffer attribute
  const colorArray = useMemo(() => {
    const arr = new Float32Array(count * 3);
    particles.forEach((p, i) => {
      p.color.toArray(arr, i * 3);
    });
    return arr;
  }, [particles, count]);

  useFrame(() => {
    if (!mesh.current) return;
    
    particles.forEach((particle, i) => {
      particle.time += particle.speed;
      particle.position.y += Math.sin(particle.time) * 0.01;
      particle.position.x += Math.cos(particle.time) * 0.005;
      
      dummy.position.copy(particle.position);
      dummy.scale.setScalar(particle.scale);
      dummy.rotation.x += particle.speed;
      dummy.rotation.y += particle.speed * 1.2;
      dummy.updateMatrix();
      
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      {/* Octahedron gives a nice diamond/gem shape */}
      <octahedronGeometry args={[1, 0]}>
        <instancedBufferAttribute attach="attributes-color" args={[colorArray, 3]} />
      </octahedronGeometry>
      <meshStandardMaterial vertexColors roughness={0.2} metalness={0.8} />
    </instancedMesh>
  );
}

export default function Scene3D() {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-10, -10, -5]} intensity={1} color="#ff00ff" />
        
        <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
          <FloatingParticles count={60} />
        </Float>
      </Canvas>
    </div>
  );
}

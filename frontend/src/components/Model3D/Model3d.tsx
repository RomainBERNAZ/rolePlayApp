// src/components/Model3D.tsx
import React from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const Model3D: React.FC<{ modelPath: string }> = ({ modelPath }) => {
  const [model, setModel] = React.useState<THREE.Group | null>(null);

  React.useEffect(() => {
    const loader = new GLTFLoader();
    loader.load(modelPath, (gltf) => {
      setModel(gltf.scene);
    });
  }, [modelPath]);

  return (
    <Canvas camera={{ position: [0, 0, 6] }} shadows>
      <ambientLight />
      <pointLight position={[10, 10, 10]} castShadow /> 
      {model && <primitive object={model} castShadow receiveShadow />} 
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  );
};

export default Model3D;
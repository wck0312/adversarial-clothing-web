'use client';

import { Canvas, useLoader } from '@react-three/fiber';
import {
  ContactShadows,
  Environment,
  OrbitControls,
  useGLTF,
} from '@react-three/drei';
import { Suspense, useEffect, useMemo } from 'react';
import * as THREE from 'three';

type Tshirt3DViewerProps = {
  color?: 'white' | 'black';
  patchImage?: string;
  patchPosition?: 'center' | 'left' | 'right';
  patchSize?: 'small' | 'medium' | 'large';
  showPatch?: boolean;
};

function PatchPlane({
  patchImage,
  patchPosition = 'center',
  patchSize = 'medium',
  showPatch = true,
}: {
  patchImage: string;
  patchPosition?: 'center' | 'left' | 'right';
  patchSize?: 'small' | 'medium' | 'large';
  showPatch?: boolean;
}) {
  const texture = useLoader(THREE.TextureLoader, patchImage);

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
  }, [texture]);

  if (!showPatch) return null;

  const x =
    patchPosition === 'left' ? -0.32 : patchPosition === 'right' ? 0.32 : 0;

  const scale =
    patchSize === 'small' ? 0.22 : patchSize === 'large' ? 0.38 : 0.3;

  return (
    <mesh position={[x, 1.3, 0.15]} renderOrder={10}>
      <planeGeometry args={[scale, scale]} />
      <meshBasicMaterial
        map={texture}
        transparent
        alphaTest={0.05}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function TshirtModel({
  color = 'white',
  patchImage = '/images/default-patch.png',
  patchPosition = 'center',
  patchSize = 'medium',
  showPatch = true,
}: Tshirt3DViewerProps) {
  const gltf = useGLTF('/models/tshirt.glb');
  const clonedScene = useMemo(() => gltf.scene.clone(), [gltf.scene]);

  const shirtColor = color === 'white' ? '#f5f5f4' : '#18181b';

  useEffect(() => {
    clonedScene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;

      const applyMaterial = (mat: THREE.Material) => {
        if (mat instanceof THREE.MeshStandardMaterial) {
          mat.color = new THREE.Color(shirtColor);
          mat.needsUpdate = true;
          mat.roughness = 0.95;
          mat.metalness = 0.0;
        }
      };

      if (Array.isArray(child.material)) {
        child.material.forEach(applyMaterial);
      } else if (child.material) {
        applyMaterial(child.material);
      }

      child.castShadow = true;
      child.receiveShadow = true;
    });
  }, [clonedScene, shirtColor]);

  return (
    <group scale={2.6} position={[0, -3.25, 0]} rotation={[0, Math.PI, 0]}>
      <primitive object={clonedScene} />
      <PatchPlane
        patchImage={patchImage}
        patchPosition={patchPosition}
        patchSize={patchSize}
        showPatch={showPatch}
      />
    </group>
  );
}

useGLTF.preload('/models/tshirt.glb');

export default function Tshirt3DViewer({
  color = 'white',
  patchImage = '/images/default-patch.png',
  patchPosition = 'center',
  patchSize = 'medium',
  showPatch = true,
}: Tshirt3DViewerProps) {
  return (
    <div className="h-[420px] w-full overflow-hidden rounded-[24px] bg-gradient-to-br from-red-50 via-zinc-50 to-zinc-100 sm:h-[500px] sm:rounded-[32px] lg:h-[580px]">
      <Canvas shadows camera={{ position: [0, 0.2, 4.8], fov: 35 }}>
        <ambientLight intensity={1.25} />

        <directionalLight
          position={[4, 5, 4]}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        <directionalLight position={[-3, 3, -2]} intensity={0.75} />

        <Suspense fallback={null}>
          <TshirtModel
            color={color}
            patchImage={patchImage}
            patchPosition={patchPosition}
            patchSize={patchSize}
            showPatch={showPatch}
          />
          <Environment preset="city" />
          <ContactShadows
            position={[0, -2.7, 0]}
            opacity={0.3}
            scale={10}
            blur={2.4}
            far={4.8}
          />
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 2.25}
          maxPolarAngle={Math.PI / 1.8}
          rotateSpeed={0.9}
        />
      </Canvas>
    </div>
  );
}
import { RigidBody, RigidBodyApi, CuboidCollider } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import React, { useMemo, useRef, useState } from "react";

THREE.ColorManagement.legacyMode = false;

// Geometries
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

// Materials
const floor1Material = new THREE.MeshStandardMaterial({ color: "limegreen" });
const floor2Material = new THREE.MeshStandardMaterial({ color: "greenyellow" });
const obstacleMaterial = new THREE.MeshStandardMaterial({ color: "orangered" });
const wallMaterial = new THREE.MeshStandardMaterial({ color: "slategray" });

function BlockStart({ position = new THREE.Vector3(0, 0, 0) }): JSX.Element {
  return (
    <group position={position}>
      <mesh
        material={floor1Material}
        geometry={boxGeometry}
        scale={[4, 0.2, 4]}
        receiveShadow
        position-y={-0.1}
      />
    </group>
  );
}

function BlockEnd({ position = new THREE.Vector3(0, 0, 0) }): JSX.Element {
  const hamburger = useGLTF("./hamburger.glb");

  hamburger.scene.children.forEach((mesh) => {
    mesh.castShadow = true;
  });

  return (
    <group position={position}>
      <mesh
        material={floor1Material}
        geometry={boxGeometry}
        scale={[4, 0.2, 4]}
        receiveShadow
      />
      <RigidBody
        type="fixed"
        position={[0, 0.25, 0]}
        colliders="hull"
        restitution={0.2}
        friction={0}
      >
        <primitive scale={0.2} object={hamburger.scene} />
      </RigidBody>
    </group>
  );
}

export function BlockSpinner({
  position = new THREE.Vector3(0, 0, 0),
}): JSX.Element {
  const spinner: React.Ref<RigidBodyApi> = useRef(null);
  const [speed] = useState(
    () => (Math.random() + 0.2) * (Math.random() < 0.5 ? -1 : 1)
  );

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    const eulerRotation = new THREE.Euler(0, time * speed, 0);
    const quaternionRotation = new THREE.Quaternion();
    quaternionRotation.setFromEuler(eulerRotation);
    spinner.current?.setNextKinematicRotation(quaternionRotation);
  });

  return (
    <group position={position}>
      <mesh
        material={floor2Material}
        geometry={boxGeometry}
        scale={[4, 0.2, 4]}
        receiveShadow
        position-y={-0.1}
      />

      <RigidBody
        type="kinematicPosition"
        ref={spinner}
        restitution={0.2}
        friction={0}
      >
        <mesh
          position-y={0.15}
          geometry={boxGeometry}
          material={obstacleMaterial}
          scale={[3.5, 0.3, 0.3]}
          castShadow
          receiveShadow
        />
      </RigidBody>
    </group>
  );
}

export function BlockLimbo({
  position = new THREE.Vector3(0, 0, 0),
}): JSX.Element {
  const limbo: React.Ref<RigidBodyApi> = useRef(null);
  const [timeOffset] = useState(() => Math.random() + Math.PI * 2);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    const y = Math.sin(time + timeOffset) + 1.15;
    limbo.current?.setNextKinematicTranslation({
      x: position.x,
      y: y + position.y,
      z: position.z,
    });
  });

  return (
    <group position={position}>
      <mesh
        material={floor2Material}
        geometry={boxGeometry}
        scale={[4, 0.2, 4]}
        receiveShadow
        position-y={-0.1}
      />

      <RigidBody
        type="kinematicPosition"
        ref={limbo}
        restitution={0.2}
        friction={0}
      >
        <mesh
          position-y={0.15}
          geometry={boxGeometry}
          material={obstacleMaterial}
          scale={[3.5, 0.3, 0.3]}
          castShadow
          receiveShadow
        />
      </RigidBody>
    </group>
  );
}

export function BlockAxe({
  position = new THREE.Vector3(0, 0, 0),
}): JSX.Element {
  const limbo: React.Ref<RigidBodyApi> = useRef(null);
  const [timeOffset] = useState(() => Math.random() + Math.PI * 2);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    const x = Math.sin(time + timeOffset) * 1.25;
    limbo.current?.setNextKinematicTranslation({
      x: x + position.x,
      y: position.y + 0.75,
      z: position.z,
    });
  });

  return (
    <group position={position}>
      <mesh
        material={floor2Material}
        geometry={boxGeometry}
        scale={[4, 0.2, 4]}
        receiveShadow
        position-y={-0.1}
      />

      <RigidBody
        type="kinematicPosition"
        ref={limbo}
        restitution={0.2}
        friction={0}
      >
        <mesh
          position-y={0.15}
          geometry={boxGeometry}
          material={obstacleMaterial}
          scale={[1.5, 1.5, 0.3]}
          castShadow
          receiveShadow
        />
      </RigidBody>
    </group>
  );
}

function Bounds({ length = 1 }): JSX.Element {
  return (
    <RigidBody type="fixed" restitution={0.2} friction={0}>
      <mesh
        castShadow
        position={[2.15, 0.75, -(length * 2) + 2]}
        geometry={boxGeometry}
        material={wallMaterial}
        scale={[0.3, 1.5, 4 * length]}
      />
      <mesh
        receiveShadow
        position={[-2.15, 0.75, -(length * 2) + 2]}
        geometry={boxGeometry}
        material={wallMaterial}
        scale={[0.3, 1.5, 4 * length]}
      />
      <mesh
        receiveShadow
        position={[0, 0.75, -(length * 4) + 2]}
        geometry={boxGeometry}
        material={wallMaterial}
        scale={[4, 1.5, 0.3]}
      />
      <CuboidCollider
        args={[2, 0.1, 2 * length]}
        position={[0, -0.1, -(length * 2) + 2]}
        restitution={0.2}
        friction={1}
      />
    </RigidBody>
  );
}

export function Level({
  count = 10,
  types = [BlockSpinner, BlockLimbo, BlockAxe],
}): JSX.Element {
  const blocks = useMemo(() => {
    const blocks = [];

    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      blocks.push(type);
    }

    return blocks;
  }, [count, types]);

  return (
    <>
      <BlockStart position={new THREE.Vector3(0, 0, 0)} />

      {blocks.map((Block, index) => (
        <Block
          key={index}
          position={new THREE.Vector3(0, 0, -(index + 1) * 4)}
        />
      ))}

      <BlockEnd position={new THREE.Vector3(0, 0, -(count + 1) * 4)} />
      <Bounds length={count + 2} />
    </>
  );
}

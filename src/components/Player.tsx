import { RigidBody, RigidBodyApi, useRapier } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import * as THREE from "three";
import React, { useEffect, useRef, useState } from "react";

function Player() {
  const [subscribedKeys, getKeys] = useKeyboardControls();
  const { rapier, world } = useRapier();
  const body: React.Ref<RigidBodyApi> = useRef(null);

  const [smoothedCameraPosition] = useState(
    () => new THREE.Vector3(10, 10, 10)
  );
  const [smoothedCameraTarget] = useState(() => new THREE.Vector3());

  const rapierWorld = world.raw();

  const jump = () => {
    const origin = body.current?.translation();

    if (origin) {
      origin.y -= 0.31;
      const direction = { x: 0, y: -1, z: 0 };
      const ray = new rapier.Ray(origin, direction);

      const hit = rapierWorld.castRay(ray, 10, true);

      if (hit!.toi < 0.15) body.current?.applyImpulse({ x: 0, y: 0.5, z: 0 });
    }
  };

  useEffect(() => {
    const unsubscribeJump = subscribedKeys(
      (state) => state.jump,
      (value) => {
        if (value) jump();
      }
    );

    return () => unsubscribeJump();
  }, []);

  useFrame((state, delta) => {
    // Controls
    const { forward, backward, leftward, rightward } = getKeys();

    const impulse = { x: 0, y: 0, z: 0 };
    const torque = { x: 0, y: 0, z: 0 };

    const impulseStrength = 0.6 * delta;
    const torqueStrength = 0.2 * delta;

    if (forward) {
      impulse.z -= impulseStrength;
      torque.x -= torqueStrength;
    }

    if (rightward) {
      impulse.x += impulseStrength;
      torque.z -= torqueStrength;
    }

    if (backward) {
      impulse.z += impulseStrength;
      torque.x += torqueStrength;
    }

    if (leftward) {
      impulse.x -= impulseStrength;
      torque.z += torqueStrength;
    }

    body.current?.applyImpulse(impulse);
    body.current?.applyTorqueImpulse(torque);

    // Camera
    const bodyPostion = body.current?.translation();

    if (bodyPostion) {
      const cameraPosition = new THREE.Vector3();
      cameraPosition.copy(bodyPostion);
      cameraPosition.z += 3.25;
      cameraPosition.y += 0.65;

      const cameraTarget = new THREE.Vector3();
      cameraTarget.copy(bodyPostion);
      cameraTarget.y += 0.25;

      smoothedCameraPosition.lerp(cameraPosition, 5 * delta);
      smoothedCameraTarget.lerp(cameraTarget, 5 * delta);

      state.camera.position.copy(smoothedCameraPosition);
      state.camera.lookAt(smoothedCameraTarget);
    }
  });

  return (
    <>
      <RigidBody
        ref={body}
        colliders="ball"
        position={[0, 1, 0]}
        restitution={0.2}
        friction={1}
        linearDamping={0.5}
        angularDamping={0.5}
      >
        <mesh castShadow>
          <icosahedronGeometry args={[0.3, 1]} />
          <meshStandardMaterial flatShading color="mediumpurple" />
        </mesh>
      </RigidBody>
    </>
  );
}

export default Player;

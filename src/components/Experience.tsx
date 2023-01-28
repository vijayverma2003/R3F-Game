import { OrbitControls } from "@react-three/drei";
import { Physics, Debug } from "@react-three/rapier";
import { Level } from "./Level";
import Lights from "./Lights";

function Experience(): JSX.Element {
  return (
    <>
      <OrbitControls makeDefault />

      <Physics>
        <Debug />
        <Lights />
        <Level />
      </Physics>
    </>
  );
}

export default Experience;

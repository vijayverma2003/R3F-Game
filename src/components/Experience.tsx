import { OrbitControls } from "@react-three/drei";
import { Physics, Debug } from "@react-three/rapier";
import { Level } from "./Level";
import Lights from "./Lights";
import Player from "./Player";

function Experience(): JSX.Element {
  return (
    <>
      {/* <OrbitControls makeDefault /> */}

      <Physics>
        {/* <Debug /> */}
        <Lights />
        <Level />
        <Player />
      </Physics>
    </>
  );
}

export default Experience;

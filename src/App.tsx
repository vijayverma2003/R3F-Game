import "./App.css";
import { Canvas } from "@react-three/fiber";
import Experience from "./components/Experience";
import { KeyboardControls } from "@react-three/drei";

function App(): JSX.Element {
  return (
    <KeyboardControls
      map={[
        {
          name: "forward",
          keys: ["ArrowUp", "KeyW"],
        },
        {
          name: "backward",
          keys: ["ArrowDown", "KeyS"],
        },
        {
          name: "leftward",
          keys: ["ArrowLeft", "KeyA"],
        },
        {
          name: "rightward",
          keys: ["ArrowRight", "KeyD"],
        },
        {
          name: "jump",
          keys: ["Space"],
        },
      ]}
    >
      <Canvas
        shadows
        camera={{
          fov: 45,
          near: 0.1,
          far: 200,
          position: [4, 5, 8],
        }}
      >
        <Experience />
      </Canvas>
    </KeyboardControls>
  );
}

export default App;

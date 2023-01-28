import "./App.css";
import { Canvas } from "@react-three/fiber";
import Experience from "./components/Experience";

function App(): JSX.Element {
  return (
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
  );
}

export default App;

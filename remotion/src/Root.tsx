import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { PhaseZoomPrototype } from "./projects/fde-part1/PhaseZoomPrototype";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <Composition
        id="PhaseZoomPrototype"
        component={PhaseZoomPrototype}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};

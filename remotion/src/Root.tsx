import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { Chunk1, CHUNK1_DURATION } from "./projects/fde-part1/Chunk1";
import {
  CaptionsTempoExperiment,
  EXPERIMENT_DURATION,
} from "./experiments/CaptionsTempoExperiment";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <Composition
        id="FdePart1-Chunk1"
        component={Chunk1}
        durationInFrames={CHUNK1_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* EXPERIMENT - not the approved pipeline, see experiments/ */}
      <Composition
        id="Experiment-CaptionsTempo"
        component={CaptionsTempoExperiment}
        durationInFrames={EXPERIMENT_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};

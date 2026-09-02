import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { FdePart1, FDE_PART1_DURATION } from "./projects/fde-part1/FdePart1";
import {
  CaptionsTempoExperiment,
  EXPERIMENT_DURATION,
} from "./experiments/CaptionsTempoExperiment";
import {
  GlowMorphExperiment,
  GLOWMORPH_DURATION,
} from "./experiments/GlowMorphExperiment";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <Composition
        id="FdePart1"
        component={FdePart1}
        durationInFrames={FDE_PART1_DURATION}
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
      <Composition
        id="Experiment-GlowMorph"
        component={GlowMorphExperiment}
        durationInFrames={GLOWMORPH_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};

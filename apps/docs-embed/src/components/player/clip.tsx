"use client";

import { ClipIcon } from "@livepeer/react/assets";
import { getSrc } from "@livepeer/react/external";
import * as Player from "@livepeer/react/player";

import { toast } from "sonner";
import { vodSource } from "./source";

export default () => {
  return (
    <Player.Root src={getSrc(vodSource)} autoPlay volume={0} clipLength={30}>
      <Player.Container>
        <Player.Video
          title="Agent 327"
          style={{ height: "100%", width: "100%" }}
        />
        <Player.LiveIndicator matcher={false} asChild>
          <Player.ClipTrigger
            style={{
              position: "absolute",
              left: 20,
              bottom: 20,
            }}
            onClip={({ playbackId, startTime, endTime }) => {
              toast(`Clip request for ${playbackId}`, {
                description: `The requested clip is from ${startTime} to ${endTime}`,
              });
            }}
          >
            <ClipIcon style={{ width: 20, height: 20 }} />
          </Player.ClipTrigger>
        </Player.LiveIndicator>
      </Player.Container>
    </Player.Root>
  );
};

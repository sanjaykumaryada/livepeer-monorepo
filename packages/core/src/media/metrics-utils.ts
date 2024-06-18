const LP_DOMAINS = ["livepeer", "livepeercdn", "lp-playback"];

// Finds the metrics reporting URL from a playback ID and a playback domain
export const getMetricsReportingUrl = async (
  playbackId: string | null,
  playbackUrl: string,
  sessionToken?: string | null,
): Promise<string | null> => {
  try {
    // This is either:
    // https://mdw-staging-staging-catalyst-0.livepeer.monster/hls/video+{playbackId}/0_6/index.m3u8
    // https://mdw-staging-staging-catalyst-0.livepeer.monster/webrtc/video+{playbackId}
    // https://vod-cdn.lp-playback.monster/raw/{id}/catalyst-vod-monster/hls/{playbackId}/270p0.mp4
    //
    // And the websocket URL should be:
    // wss://mdw-staging-staging-catalyst-0.livepeer.monster/json_video+{playbackId}.js?tkn=adb42a8f47438
    const parsedUrl = new URL(playbackUrl);

    const splitHost = parsedUrl.host.split(".");
    const includesDomain = LP_DOMAINS.includes(
      splitHost?.[splitHost.length - 2] ?? "",
    );
    const tld = (splitHost?.[splitHost?.length - 1] ?? null) as
      | "com"
      | "studio"
      | "fun"
      | "monster"
      | null;

    // map to known TLDs, with .com => .studio
    const tldMapped =
      tld === "com"
        ? "studio"
        : tld === "studio"
          ? "studio"
          : tld === "fun"
            ? "fun:20443"
            : tld === "monster"
              ? "monster"
              : null;

    // if not a known TLD, then do not return a URL
    if (playbackId && includesDomain && tldMapped) {
      const isCatalystPlayback = parsedUrl.host.includes("catalyst");

      try {
        const getRedirectedUrl = async (): Promise<string | null> => {
          const response = await fetch(
            `https://playback.livepeer.${tldMapped}/json_video+${playbackId}.js`,
          );

          return response?.url ?? null;
        };

        const finalUrl = isCatalystPlayback
          ? `https://${parsedUrl.host}/json_video+${playbackId}.js`
          : await getRedirectedUrl();

        // parse the url which we're redirected to
        const redirectedUrl = finalUrl?.replace("https:", "wss:");

        const url = redirectedUrl ? new URL(redirectedUrl) : null;

        if (url && sessionToken) {
          url.searchParams.set("tkn", sessionToken);
        }

        return url?.toString?.() ?? null;
      } catch (error) {
        console.log("Could not fetch metrics reporting URL.", error);
      }
    }
  } catch (error) {
    console.error((error as Error)?.message);
    return null;
  }

  return null;
};

const ASSET_URL_PART_VALUE = "hls";
const FLV_URL_PART_VALUE = "flv";
const WEBRTC_URL_PART_VALUE = "webrtc";
const RECORDING_URL_PART_VALUE = "recordings";

export const getPlaybackIdFromSourceUrl = (sourceUrl: string) => {
  const parsedUrl = new URL(sourceUrl);

  const parts = parsedUrl.pathname.split("/");

  const includesAssetUrl = parts.includes(ASSET_URL_PART_VALUE);
  const includesWebRtcUrl = parts.includes(WEBRTC_URL_PART_VALUE);
  const includesFlvUrl = parts.includes(FLV_URL_PART_VALUE);
  const includesRecording = parts.includes(RECORDING_URL_PART_VALUE);

  // Check if the url is valid
  const playbackId =
    includesWebRtcUrl || includesFlvUrl
      ? parts?.[(parts?.length ?? 0) - 1]
      : includesRecording || includesAssetUrl
        ? parts?.[(parts?.length ?? 0) - 2] ?? null
        : null;

  if (playbackId?.includes("+")) {
    const split = playbackId.split("+")?.[1];

    if (split) {
      return split;
    }
  }

  return playbackId ?? null;
};

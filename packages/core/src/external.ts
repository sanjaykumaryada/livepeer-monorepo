export type Address = `0x${string}`;
export type Hash = `0x${string}`;

export { getIngest, getSrc } from "./media/external";
export type {
  CloudflareStreamData,
  CloudflareUrlData,
  LivepeerAttestation,
  LivepeerAttestationIpfs,
  LivepeerAttestationStorage,
  LivepeerAttestations,
  LivepeerDomain,
  LivepeerMessage,
  LivepeerMeta,
  LivepeerName,
  LivepeerPhase,
  LivepeerPlaybackInfo,
  LivepeerPlaybackInfoType,
  LivepeerPlaybackPolicy,
  LivepeerPrimaryType,
  LivepeerSignatureType,
  LivepeerSource,
  LivepeerStorageStatus,
  LivepeerStream,
  LivepeerTasks,
  LivepeerTypeT,
  LivepeerVersion,
} from "./media/external";

import { Wormhole } from "portal-vue";

export function hasPortalContentFor(name) {
  const transports = Wormhole.transports[name];
  return transports && transports.length;
}
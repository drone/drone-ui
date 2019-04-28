export function isBuildFinished(build) {
  return build.finished || build.status === "declined";
}

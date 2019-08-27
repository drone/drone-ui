export function isBuildFinished(build) {
  return build.finished || build.status === "declined";
}

export function getBuildActor(build) {
  if (build.event === "promote") {
    return build.trigger;
  }
  return build.author_login;
}

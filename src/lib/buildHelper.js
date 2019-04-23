export function isBuildFinished(build) {
  return build.finished || build.status === "declined";
}

export function getBuildAvatar(build) {
  if (build.event === "promote") {
    return null;
  }
  return build.author_avatar;
}

export function getBuildActor(build) {
  if (build.event === "promote") {
    return build.trigger;
  }
  return build.author_login;
}

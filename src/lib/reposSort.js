function byRepoNameAsc(a, b) {
  if (a.slug < b.slug) return -1;
  if (a.slug > b.slug) return 1;
  return 0;
}

function byStatus(a, b) {
  if (!a.active && b.active) return 1;
  if (a.active && !b.active) return -1;
  return 0;
}

function byBuildPresence(a, b) {
  if (!a.build && b.build) return 1;
  if (a.build && !b.build) return -1;
  return 0;
}

export function byBuildCreatedAtDesc(a, b) {
  return (b.build ? b.build.created : 0) - (a.build ? a.build.created : 0);
}

function combineConditions() {
  const conditions = arguments;

  return function(a, b) {
    let result;
    let conditionIndex = 0;

    do {
      result = conditions[conditionIndex](a, b);
      conditionIndex += 1;
    } while (result === 0 && conditionIndex < conditions.length);

    return result;
  };
}

const condition = combineConditions(byBuildCreatedAtDesc, byStatus, byRepoNameAsc);

export default function reposSort(repos) {
  return repos.slice(0).sort(condition);
}

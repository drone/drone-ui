export function byRepoNameAsc(a, b) {
  if (a.slug < b.slug) return -1;
  if (a.slug > b.slug) return 1;
  return 0;
}

// active first
function byStatus(a, b) {
  return Number(b.active) - Number(a.active);
}

export function byBuildCreatedAtDesc(a, b) {
  return (b.build?.created ?? 0) - (a.build?.created ?? 0);
}

const combineConditions = (...sortFunctions) => (a, b) => {
  let result;

  sortFunctions.forEach((fn) => {
    if (!result) {
      result = fn(a, b);
    }
  });

  return result;
};

const condition = combineConditions(byStatus, byBuildCreatedAtDesc, byRepoNameAsc);

export default function sortRepos(repos) {
  return repos?.slice(0).sort(condition);
}

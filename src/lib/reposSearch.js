export default function reposSearch(repos, query) {
  const results = [];
  const lowercasedQuery = query.toLowerCase();
  const [byNamespace, byName] = lowercasedQuery.split("/");

  for (let i = 0; i < repos.length; ++i) {
    const repo = repos[i];
    const match =
      byName === undefined
        ? repo.slug.toLowerCase().indexOf(lowercasedQuery) > -1
        : repo.namespace.toLowerCase().indexOf(byNamespace) > -1 && repo.name.toLowerCase().indexOf(byName) > -1;

    if (match) {
      results.push(repo);
    }
  }

  return results;
}

export default function reposSearch(repos, query) {
  const results = [];
  const lowercasedQuery = query.toLowerCase();
  const [byNamespace, byName] = lowercasedQuery.split('/');

  repos.forEach((repo) => {
    const match = !byName
      ? repo.slug.toLowerCase().indexOf(lowercasedQuery) > -1
      : repo.namespace.toLowerCase().indexOf(byNamespace) > -1
      && repo.name.toLowerCase().indexOf(byName) > -1;
    if (match) {
      results.push(repo);
    }
  });

  return results;
}

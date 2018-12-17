export async function dispatchTypicalFetch(store, params, mutationBaseName, fetchFunc) {
  const MUTATION_LOADING = `${mutationBaseName}_LOADING`;
  const MUTATION_FAILURE = `${mutationBaseName}_FAILURE`;
  const MUTATION_SUCCESS = `${mutationBaseName}_SUCCESS`;

  let error = null;
  let req = null;
  let res = null;
  store.commit(MUTATION_LOADING, { params });

  try {
    req = await fetchFunc();

    try {
      res = await req.json();
    } catch (e2) {
      res = {};
    }
  } catch (e) {
    error = { message: e.message, status: null };
  }

  if (!error && req.status > 299) {
    error = { status: req.status, message: res.message };
  }

  if (error) {
    store.commit(MUTATION_FAILURE, { params, error });
    throw error;
  } else {
    store.commit(MUTATION_SUCCESS, { params, res });
  }
}

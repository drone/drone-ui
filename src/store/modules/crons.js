import {instance, headers} from "../../actions/config";

export const CRON_LIST_LOADING = 'CRON_LIST_LOADING';
export const CRON_LIST_SUCCESS = 'CRON_LIST_SUCCESS';
export const CRON_LIST_FAILURE = 'CRON_LIST_FAILURE';

/**
 * fetchCrons fetches the cron list and dispatches an
 * event to update the store.
 */
export const fetchCrons = async ({commit}, {namespace, name}) => {
	commit(CRON_LIST_LOADING);

	const req = await fetch(`${instance}/api/repos/${namespace}/${name}/cron`, {headers, credentials: 'same-origin'});
	const res = await req.json();

	if (req.status > 299) {
		commit(CRON_LIST_FAILURE, {namespace, name, error: res});
	} else {
		commit(CRON_LIST_SUCCESS,  {namespace, name, secrets: res});
	}
}

export const CRON_DELETE_LOADING = 'CRON_DELETE_LOADING';
export const CRON_DELETE_SUCCESS = 'CRON_DELETE_SUCCESS';
export const CRON_DELETE_FAILURE = 'CRON_DELETE_FAILURE';

/**
 * deleteCron deletes the cron job and dispatches an event
 * to purge the object from the store.
 */
export const deleteCron = async ({commit}, {namespace, name, cron}) => {
	commit(CRON_DELETE_LOADING)

	const req = await fetch(`${instance}/api/repos/${namespace}/${name}/cron/${cron.name}`, {headers, method: 'DELETE', credentials: 'same-origin'});

	if (req.status < 300) {
        commit(CRON_DELETE_SUCCESS, {namespace, name, cron});
	} else {
        const res = await req.json();
        commit(CRON_DELETE_FAILURE, {namespace, name, error: res});
    }
}

export const CRON_CREATE_LOADING = 'CRON_CREATE_LOADING';
export const CRON_CREATE_SUCCESS = 'CRON_CREATE_SUCCESS';
export const CRON_CREATE_FAILURE = 'CRON_CREATE_FAILURE';

/**
 * createCron creates the cron job and dispatches an event
 * to purge the object from the store.
 */
export const createCron = async ({commit}, {namespace, name, cron}) => {
	commit(CRON_CREATE_LOADING);

	const body = JSON.stringify(cron);
	const req = await fetch(`${instance}/api/repos/${namespace}/${name}/cron`, {headers, method: 'POST', body, credentials: 'same-origin'});
    const res = await req.json();

	if (req.status > 299) {
		commit(CRON_CREATE_FAILURE, {namespace, name, error: res});
	} else {
		commit(CRON_CREATE_SUCCESS, {namespace, name, cron: res});
	}
}




const state = {
    items: {}, // cron items by repository.
    loading: {},
    creating: {},
    deleting: {},
}

const actions = {
    findCrons: fetchCrons,
    createCron: createCron,
    deleteCron: deleteCron,
}

const mutations = {
    setLoading(state, data) {
        state.loading = data;
    },

    setCreating(state, data) {
        state.creating = data;
    },

    setDeleting(state, data) {
        state.deleting = data;
    },

    setList(state, data) {
        let slug = data.namepsace+"/"+data.name;
        Vue.set(state.items, slug, data.crons);
    },

    pushItem(state, data) {
        let slug = data.namepsace+"/"+data.name;
        let items = state.items[slug];
        if (!items) {
            items = [];
        }
        items.push(data.cron);
        Vue.set(state.items, slug, items);
    },

    deleteItem(data, data) {
        let slug = `${data.namespace}/${data.name}`;
        let items = state.crons[slug];
        if (items) {
          Vue.delete(crons, data.cron.name, data.cron);
          Vue.set(state.crons, slug, crons);
        }
    },

    CRON_LIST_LOADING(state){},
    CRON_LIST_FAILURE(state, e){},
    CRON_LIST_SUCCESS(state, data){
      const slug = `${data.namespace}/${data.name}`;
      let set = {};
			data.secrets.map(item => {
				set[item.name] = item;
			});
      Vue.set(state.crons, slug, set);
    },
  
    CRON_CREATE_LOADING(state){},
    CRON_CREATE_FAILURE(state, e){},
    CRON_CREATE_SUCCESS(state, data){
      const slug = `${data.namespace}/${data.name}`;
      let crons = state.crons[slug];
      if (!crons) {
        Vue.set(state.crons, slug, {[data.cron.name]: data.cron});
      } else {
        Vue.set(crons, data.cron.name, data.cron);
        Vue.set(state.crons, slug, crons);
      }
    },

    CRON_DELETE_LOADING(state){},
    CRON_DELETE_FAILURE(state, e){},
    CRON_DELETE_SUCCESS(state, data){
      const slug = `${data.namespace}/${data.name}`;
      let crons = state.crons[slug];
      if (crons) {
        Vue.delete(crons, data.cron.name, data.cron);
        Vue.set(state.crons, slug, crons);
      }
    },
}

export default {
    namespaced: true,
    state,
    actions,
    mutations
}

import {
	cancelBuild,
	fetchBuild,
	fetchBuilds,
	createBuild,
} from "./build";

import {
	deleteCron,
	createCron,
	updateCron,
	fetchCron,
	fetchCrons,
} from "./cron";

import {
	streamEvents,
	streamLogs,
} from "./stream";

import {
	fetchLogs,
} from "./logs";

import {
	fetchMembers,
	deleteMember,
} from "./member";

import {
	chownRepo,
	disableRepo,
	enableRepo,
	fetchRepo,
	fetchRepos,
	fetchReposLatest,
	repairRepo,
	syncRepos,
	updateRepo,
} from "./repo";

import {
	createSecret,
	deleteSecret,
	fetchSecret,
	fetchSecrets,
	updateSecret,
} from "./secret";

import {
	fetchViewer,
	fetchViewerToken,
} from "./viewer";

export default {
	cancelBuild,
	chownRepo,
	createBuild,
	createCron,
	createSecret,
	deleteCron,
	deleteMember,
	deleteSecret,
	disableRepo,
	enableRepo,
	fetchBuild,
	fetchBuilds,
	fetchCron,
	fetchCrons,
	fetchLogs,
	fetchMembers,
	fetchRepo,
	fetchRepos,
	fetchReposLatest,
	fetchSecret,
	fetchSecrets,
	fetchViewer,
	fetchViewerToken,
	repairRepo,
	streamEvents,
	streamLogs,
	updateCron,
	updateRepo,
	updateSecret,
	syncRepos,
}
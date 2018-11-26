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
	streamEvents
} from "./stream";

import {
	fetchLogs,
  downloadLogs,
  streamLogs
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
	syncAccount,
	syncPoll,
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
  downloadLogs,
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
	syncAccount,
	syncPoll,
}
import {
	cancelBuild,
	fetchBuild,
	fetchBuilds,
	createBuild,
  fetchBuildsFeed,
  streamEvents
} from "./build";

import {
	deleteCron,
	createCron,
	updateCron,
	fetchCron,
	fetchCrons,
} from "./cron";

import {
	fetchLogs,
  streamLogs
} from "./logs";

import {
	fetchMembers,
	deleteMember,
} from "./member";

import {
	deleteNode,
	fetchNode,
	fetchNodes,
	updateNode,
} from "./node";

import {
	chownRepo,
	disableRepo,
	enableRepo,
	fetchRepo,
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

import {
  showNotification,
  hideNotification
} from "./notifications"

export default {
	cancelBuild,
	chownRepo,
	createBuild,
	createCron,
	createSecret,
	deleteCron,
	deleteMember,
	deleteNode,
	deleteSecret,
	disableRepo,
	enableRepo,
	fetchBuild,
	fetchBuilds,
  fetchBuildsFeed,
	fetchCron,
	fetchCrons,
	fetchLogs,
	fetchMembers,
	fetchNode,
	fetchNodes,
	fetchRepo,
	fetchReposLatest,
	fetchSecret,
	fetchSecrets,
	fetchViewer,
	fetchViewerToken,
	repairRepo,
	streamEvents,
	streamLogs,
	updateCron,
	updateNode,
	updateRepo,
	updateSecret,
  showNotification,
  hideNotification,
	syncRepos,
	syncAccount,
	syncPoll,
}
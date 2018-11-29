import {
	cancelBuild,
	fetchBuild,
	fetchBuilds,
	createBuild,
  fetchBuildsFeed
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
  showNotification,
  hideNotification,
	syncRepos,
	syncAccount,
	syncPoll,
}
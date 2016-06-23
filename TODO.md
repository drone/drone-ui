
### Overall:

1. set page titles

### Feed / Aside:

1. hook up to websocket
2. show alert when no repos in the list

### Repository:

1. subscribe to the same websocket as the feed (share same websocket)
2. using websocket, update build list. add or udpdate items
3. show alert when no builds in the list
4. show settings tab iff user is authenticated and has write access

### Repository Settings:

1. show snackbar on successful save, or on error message

### Build:

1. subscribe to the same websocket as the feed (share same websocket)
2. use the websocket to update the build details, start streaming, etc
3. if matrix build, show a list of jobs. otherwise go right to logs
4. make sure we can still stream the build after changes brad made
5. make sure cancel, restart, follow are hooked back up

### Repository Settings:

1. add refresh button to refresh the repository list
2. show a repository list, with switches, to enable / disable the repository
3. use the snackbar to show the repository was enabled, disabled, error


### Bugs

1. build logs reset after streaming completes, shows "Loading ..."
2. sometimes switching between repos results in "Repository was null while trying to add builds to it"
3. new builds received from websocket not correctly appended to build history

### Overall:

1. set page titles

### Feed / Aside:

1. show alert when no repos in the list

### Repository:

1. show settings tab iff user is authenticated and has write access (requires API change)

### Repository Settings:

1. show snackbar on successful save, or on error message

### Build:

1. if matrix build, show a list of jobs. otherwise go right to logs
2. hook up cancel, restart
3. add link external link to commit on build-panel

### Repository Settings:

1. hook up refresh button to refresh the repository list
2. style the repository list and add toggles to enable / disable
3. use the snackbar to show the repository was enabled, disabled, error

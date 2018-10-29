<template>
  <footer>
    <nav>
        <a target="_blank" href="https://readme.drone.io">Documentation</a>
        <a target="_blank" href="http://plugins.drone.io">Plugins</a>
        <a target="_blank" href="https://discourse.drone.io">Support</a>
    </nav>
    <nav>
        <a target="_blank" href="https://github.com/drone">GitHub</a>
        <a target="_blank" href="https://twitter.com/droneio">Twitter</a>
        <a target="_blank" href="https://discourse.drone.io">Discourse</a>
        <a target="_blank" href="https://gitter.im/drone/drone">Gitter</a>
    </nav>
  </footer>
</template>

<style scoped>
footer {
    display: flex;
}

nav {
    flex: 1;
    text-align: right;
    align-items: center;
    align-content: center;
    justify-content: flex-start;
    display: flex;
    padding: 0px 0px;
}

nav:last-of-type {
    justify-content: flex-end;
}

nav a {
    font-size: 13px;
    margin: 0px 15px;
    text-decoration: none;
    color: #8f99a4;
}

nav a:hover {
    color: #0061da;
}
</style>

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
  justify-content: space-between;
  padding: 0 30px;
  align-items: center;
}

nav a {
  color: rgba(25, 45, 70, 0.6);
  transition: color linear 0.2s;
}

nav a:hover,
nav a:focus {
  color: #192d46;
  outline: none;
}

nav a + a {
  margin-left: 30px;
}
</style>

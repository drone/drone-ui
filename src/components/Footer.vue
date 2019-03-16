<template>
  <footer>
    <nav>
        <a target="_blank" href="https://readme.drone.io">Documentation</a>
        <a target="_blank" href="http://plugins.drone.io">Plugins</a>
        <a target="_blank" href="https://discourse.drone.io">Support</a>
    </nav>
    <nav class="nav-right">
        <a target="_blank" href="https://github.com/drone">GitHub</a>
        <a target="_blank" href="https://twitter.com/droneio">Twitter</a>
        <a target="_blank" href="https://discourse.drone.io">Discourse</a>
        <a target="_blank" href="https://gitter.im/drone/drone">Gitter</a>
    </nav>
  </footer>
</template>

<style scoped lang="scss">
@import "../assets/styles/mixins";

footer {
  display: flex;
  justify-content: space-between;
  padding: 0 $header-padding-side;
  align-items: center;
  z-index: 1;

  box-sizing: border-box;
  min-height: 60px;

  @include tablet {
    padding-top: 20px;
    padding-bottom: 20px;
    flex-direction: column;
  }
}

nav.nav-right {
  @include tablet {
    margin-top: 15px;
  }
}

nav a {
  color: $color-text-secondary;

  & + a {
    margin-left: 30px;
  }
}

nav a:hover,
nav a:focus {
  color: $color-text;
  outline: none;
}
</style>

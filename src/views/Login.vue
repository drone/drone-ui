<template>
  <div class="login">
    <form action="/login" method="POST">
      <p>Login user your Gogs (or Gitea) username and password.</p>
      <input name="username" placeholder="username" type="text" />
      <input name="password" placeholder="password" type="password" />
      <button type="submit">Login</button>
    </form>
  </div>
</template>

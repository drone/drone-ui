<template>
  <div class="container">
    <div class="login">
      <form action="/login" method="POST">
        <div class="logo">
          <Logo />
        </div>
        <p>Login user your Source Code Management system username and password.</p>
        <input name="username" placeholder="username" type="text" />
        <input name="password" placeholder="password" type="password" />
        <button type="submit">Login</button>
      </form>
    </div>
  </div>
</template>

<script>
import Logo from "@/components/Logo.vue";

export default {
  name: "login",
  components: {
    Logo
  }
};
</script>

<style scoped>
div.container {
  align-items: center;
  background: #fbfbfb;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  padding: 30px;
  height: 100%;
  width: 100%;
}

.login {
  width: 300px;

  background: #FFF;
  border: 1px solid #e8eaed;
  border-radius: 3px;
  box-shadow: 0px 0px 8px 1px #e8eaed;
  padding: 30px;
}

p {
  font-size: 15px;
  line-height: 18px;
  margin-bottom: 20px;
  text-align: center;
}

form input {
  border-radius: 3px;
  border: 1px solid #e8eaed;
  box-sizing: border-box;
  display: block;
  font-size: 13px;
  margin: 10px 0px;
  outline: none;
  padding: 7px 10px;
  resize: none;
  width: 100%;
}

form input:focus{
  border: 1px solid #0060da;
}

form button {
  border: none;
  background: #222222;
  border-radius: 3px;
  box-sizing: border-box;
  color: #FFF;
  display: block;
  font-size: 12px;
  padding: 10px 20px;
  text-transform: uppercase;
  width: 100%;
}

svg {
  width: 28px;
  height: 28px;
}

.logo {
  text-align: center;
  margin-bottom: 30px;
}
</style>
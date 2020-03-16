<template>
  <div class="container">
    <div class="login">
      <form action="/login" method="POST">
        <div class="logo"><Logo /></div>
        <BaseInput name="username" placeholder="Login" type="text" />
        <BaseInput name="password" placeholder="Password" type="password" />
        <Button type="submit" theme="primary" size="l">Login</Button>
      </form>
    </div>
  </div>
</template>

<script>
import Logo from "@/components/logos/Logo.vue";
import BaseInput from "@/components/forms/BaseInput.vue";
import Button from "@/components/buttons/Button.vue";

export default {
  name: "login",
  components: {
    Logo,
    BaseInput,
    Button
  }
};
</script>

<style scoped lang="scss">
@import "../assets/styles/variables";
@import "../assets/styles/mixins";

div.container {
  align-items: center;
  display: flex;
  justify-content: center;
  height: 100%;
  width: 100%;
}

.login {
  width: 340px;
  padding: 70px 20px 30px;
  border-radius: 5px;
  position: relative;
  @include themed {
    background-color: tget("surface-color");
    box-shadow: 0 2px 4px 0 tget("border-color");
  }
  @include themed-only(dark) {
    box-shadow: 0 2px 4px 0 darken(tget("body-color"), 20%);
  }
}

.logo {
  text-align: center;
  padding: 16px;
  margin-bottom: 30px;
  position: absolute;
  top: -41px;
  left: 50%;
  margin-left: -41px;
  border-radius: 50%;
  @include themed-only(default) {
    background: #fbfbfb;
  }
  @include themed-only(dark) {
    background: #000;
  }
}

.logo > svg {
  width: 50px;
  height: 50px;
}

form input {
  margin-bottom: 30px;
  width: 100%;
}

.button {
  width: 100%;
}
</style>

<template>
  <a class="link"><slot></slot></a>
</template>

<style>
.link {
  text-decoration: none;
  color: #0564d7;
  height: 18px;
}

.link:focus,
.link:hover {
  position: relative;
  color: #0564d7;
  outline: none;
}

.link:focus:after,
.link:hover:after {
  content: "";
  position: absolute;
  bottom: -2px;
  height: 1px;
  background-color: rgba(5, 100, 215, 0.5);
  right: 0;
  left: 0;
}
</style>

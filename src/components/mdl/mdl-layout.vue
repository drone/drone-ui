<script>
export default {
  ready () {
    componentHandler.upgradeElements(this.$el)
  }
}
</script>

<template>
  <div class="mdl-layout mdl-js-layout mdl-layout--fixed-drawer mdl-layout--fixed-header">
    <header class="mdl-layout__header">
      <div class="mdl-layout__header-row">
        <span class="mdl-layout-title">
          <slot name="header"></slot>
        </span>

        <div>
          <button id="demo-menu-lower-right" class="mdl-button mdl-js-button mdl-button--icon">
            <i class="material-icons">more_vert</i>
          </button>

          <ul class="mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect"
              for="demo-menu-lower-right">
            <li class="mdl-menu__item"><a v-link="{ name: 'index' }">Builds</a></li>
            <li class="mdl-menu__item"><a v-link="{ name: 'settings' }">Account</a></li>
            <li class="mdl-menu__item"><a href="/logout">Logout</a></li>
          </ul>

        </div>
      </div>
    </header>
    <div class="mdl-layout__drawer">
      <span class="mdl-layout-title">
        <a v-link="{ name: 'index' }">DRONE</a>
      </span>
      <nav class="mdl-navigation">
        <slot name="aside"></slot>
      </nav>
    </div>
    <main class="mdl-layout__content">
      <div class="page-content">
        <slot></slot>
      </div>
    </main>
  </div>
</template>

<style lang="less">
@drawer-width: 320px;

.mdl-layout__header {
  background: #FFF;
  box-shadow: none;
  border-bottom: 1px solid #EEE;
  height: 80px;
  min-height:80px;
  max-height:80px;

  .mdl-layout-title {
    color: #212121;
    font-size: 22px;
  }

  .material-icons {
    color: #212121;
  }
}

// .mdl-layout__content {
//   &> .content {
//     padding: 40px;
//   }
// }

.mdl-layout__drawer .mdl-navigation {
  padding-top:0px;
}

.mdl-layout__drawer {
  width: @drawer-width;
  background: #FFF;
  border-right: 1px solid #EEE;
  box-shadow: 2px 2px 2px rgba(0,0,0,0.05);
}

@media screen and (max-width: 1024px) {
    .mdl-layout--fixed-drawer > .mdl-layout__inner-container > .mdl-layout__content {
      margin-left:0px;
    }
    .mdl-layout__drawer {
      -webkit-transform: translateX(-@drawer-width);
      transform: translateX(-@drawer-width);
    }
}

.mdl-layout__header-row {
  padding-right: 10px;

  &> div:first-child {
    flex: 1 1 auto;
    -webkit-flex: 1 1 auto;
  }

  &> div:last-child {
    white-space: nowrap;
  }
}

@media screen and (min-width: 1025px) {
  .mdl-layout--fixed-drawer .mdl-layout__content {
    margin-left: @drawer-width;
  }

  .mdl-layout--fixed-drawer > .mdl-layout__inner-container > .mdl-layout__header .mdl-layout__header-row {
    padding-left: (@drawer-width - 200);
  }

  .mdl-layout--fixed-drawer.is-upgraded:not(.is-small-screen)>.mdl-layout__header {
    margin-left: @drawer-width;
    width: ~"calc(100% - 320px)";
  }
}

.brand {
  height: 80px;
  min-height:80px;
  max-height:80px;
  box-sizing: border-box;
  border-bottom: 1px solid #EEE;

  a {
    display:inline-block;
    margin-top: 10px;
    margin-left: 15px;
  }
}

.mdl-layout__header-row {
  box-sizing: border-box;
  display: -webkit-flex;
  display: flex;

  .mdl-layout-title {
    display: block;
    flex: 1 1 auto;
    -webkit-flex: 1 1 auto;

    ol {
      margin: 0;
      padding: 0;
      line-height: normal;
    }

    li {
      display: inline-block;
      font-size: 22px;
      line-height: normal;
      vertical-align: middle;
      color: #212121;

      a {
        color: #212121;
        text-decoration: none;
        vertical-align: middle;
        line-height: 30px;
      }

      .material-icons {
        vertical-align: middle;
      }
    }
  }

  div {
    width:200px;
    text-align:right;

    a {
      color: #212121;
      text-decoration: none;
      vertical-align: middle;
      line-height: 30px;
    }
  }
}
</style>

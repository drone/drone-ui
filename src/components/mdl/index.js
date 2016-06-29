
import MdlButton from './mdl-button.vue';
import MdlDialog from './mdl-dialog.vue';
import MdlLayout from './mdl-layout.vue';
import MdlSlider from './mdl-slider.vue';
import MdlSnackbar from './mdl-snackbar.vue';
import MdlSwitch from './mdl-switch.vue';

export const components = {
  MdlButton,
  MdlDialog,
  MdlLayout,
  MdlSlider,
  MdlSnackbar,
  MdlSwitch,
}

export default {
  install (Vue) {
    Object.keys(components).forEach((name) => {
      Vue.component(name, components[name])
    })
  }
}

export {
  MdlButton,
  MdlButton,
  MdlSlider,
  MdlSnackbar,
  MdlSwitch,
}

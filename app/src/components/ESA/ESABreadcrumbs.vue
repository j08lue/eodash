<template>
  <div
    class="gtif-breadcrumbs"
    :style="{'margin-left': $route.name === 'explore' ? '88px' : '0'}"
  >
    <div class="fill-width fill-height d-flex justify-between align-center pl-6">
      <span class="bold">GTIF</span>
      <span class="px-2">|</span>
      <span>Green Transition Information Factory</span>
      <span v-if="areBreadcrumbsEnabled" class="px-2 green-crumb">&gt;</span>
      <span v-if="areBreadcrumbsEnabled" class="green-crumb">{{ currentBreadcrumb }}</span>
    </div>
  </div>
</template>

<script>
// Utilities
import {
  mapState,
} from 'vuex';

export default {
  name: 'ESABreadcrumbs',
  props: {
    areBreadcrumbsEnabled: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    ...mapState('config', [
      'appConfig',
    ]),

    currentBreadcrumb() {
      switch (this.$route.name) {
        case 'gtif-energy-transition':
          return 'Energy Transition';

        case 'gtif-mobility-transition':
          return 'Mobility Transition';

        case 'gtif-sustainable-transition':
          return 'Sustainable Cities';

        case 'gtif-social-mobility':
          return 'Social Mobility';

        case 'gtif-carbon-finance':
          return 'Carbon Accounting';

        case 'gtif-eo-adaptation':
          return 'EO Adaptation Services';

        case 'explore':
          return 'Explore Tool';

        default:
          return '';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.gtif-breadcrumbs {
  background: #1E4B5F;
  width: 100%;
  height: 48px;
  position: fixed;
  top: 64px;
  font-size: 18px;
  color: #CDD7DA;

  .bold {
    font-family: 'NotesESABold';
  }

  .green-crumb {
    color: #00ae9d;
  }
}
</style>

<template>
  <div id="app">
    <router-view v-if="isRouterAlive" />
  </div>
</template>
<script>
  import {getMethod} from '@/api';
  import Cookies from 'js-cookie';

  export default {
    name: 'app',
    provide() {
      return {
        reload: this.reload
      };
    },
    data() {
      return {
        isRouterAlive: true
      };
    },
    methods: {
      reload() {
        this.isRouterAlive = false;
        this.$nextTick(function() {
          this.isRouterAlive = true;
        });
      }
    },
  };
</script>

<template>
  <div id="app">
    <v-header />
    <router-view />
  </div>
</template>
<script>
import vHeader from './components/header/header';
export default {
  name: 'app',
  components: {
    vHeader,
  },
};
</script>
<style lang="scss">
html,
body,
#app {
  height: 100%;
}
body {
  padding: 0;
  margin: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>

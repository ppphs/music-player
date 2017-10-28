<template>
  <div id="app">
    <my-header></my-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script type="text/ecmascript-6">
import myHeader from 'components/myHeader/myHeader'
import Tab from 'components/tab/tab'

export default {
  components: {
    myHeader,
    Tab
  }
}
</script>

<style lang="stylus">
  #app
    overflow: hidden
</style>

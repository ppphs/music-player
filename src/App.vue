<template>
  <div id="app">
    <my-header></my-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script type="text/ecmascript-6">
import myHeader from 'components/myHeader/myHeader'
import Tab from 'components/tab/tab'
import player from 'components/player/player'

export default {
  components: {
    myHeader,
    Tab,
    player
  }
}
</script>

<style lang="stylus">
  #app
    overflow: hidden
</style>

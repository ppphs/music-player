<template>
  <div class="my-header" @touchmove.prevent>
    <div class="icon"></div>
    <div class="text">火鸡音乐</div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
}
</script>

<style lang="stylus">
  @import '~common/stylus/variable.styl'
  @import '~common/stylus/mixin.styl'

  .my-header
    position: relative
    height: 44px
    text-align: center
    color: $color-theme
    font-size: 0
    .icon
      display: inline-block
      vertical-align: top
      margin-top: 6px
      width: 30px
      height: 32px
      margin-right: 9px
      bg-image('logo')
      background-size: 30px 32px
    .text
      display: inline-block
      vertical-align: top
      line-height: 44px
      font-size: $font-size-large
</style>

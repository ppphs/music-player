<template>
  <div class="singer-detail" @scroll="playWrapperFixed" ref="singerDetail">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <div class="detail-head">
      <div class="info">
        <div class="left">
          <img width="125px" height="125px" :src="this.detailSinger.avatar" alt="">
        </div>
        <div class="right">
          <h1 class="title">{{ detailSinger.name }}</h1>
          <p class="fans" v-show="fans !== 0">粉丝：{{ formatFans }}万</p>
          <p class="desc" @click="showMoreTrigger" v-show="singerDesc !== ''">{{ singerDesc }}</p>
        </div>
      </div>
      <div :class="[{playWrapper: true}, {fixed: fixed}]">
        <div class="play">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
    </div>
    <ul class="container">
      <li @click="selectItem(song, index)" v-for="(song, index) in songs" :key="index" class="song">
        <h2 class="name">{{ song.name }}</h2>
        <div class="description">{{ `${song.singer}${song.albumdesc ? (' · ' + song.albumdesc) : ''}` }}</div>
      </li>
    </ul>
    <div class="singerDesc" v-show="singerDescShow">
      <div class="filter" @touchmove.prevent></div>
      <div class="main">
        <p class="text">{{ singerDesc }}</p>
        <div class="close" @click="showMoreTrigger">关闭</div>
      </div>
    </div>
    <loading v-if="songs.length === 0"></loading>
  </div>
</template>

<script>
import {getSingerDetail} from 'api/singer.js'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'
import loading from 'base/loading/loading'
import {mapActions} from 'vuex'

export default {
  data () {
    return {
      songs: [],
      singerDesc: '',
      fans: 0,
      fixed: false,
      singerDescShow: false
    }
  },
  props: {
    detailSinger: {
      type: Object
    }
  },
  computed: {
    formatFans () {
      return (this.fans / 10000).toFixed(1)
    }
  },
  created () {
    if (this.$store.state.detailId === 0) { // 用户在详情页刷新就会直接回到歌手页
      this.$router.push('/singer')
    }
    this._getSingerDetail()
  },
  methods: {
    _getSingerDetail () {
      getSingerDetail(this.$store.state.detailId).then(res => {
        if (res.code === ERR_OK) {
          this.songs = this.normalizeSongData(res.data.list)
          this.singerDesc = res.data.SingerDesc
          this.fans = res.data.fans
        }
      })
    },
    normalizeSongData (list) {
      let ret = []
      list.forEach(item => {
        ret.push(createSong(item.musicData))
      })
      return ret
    },
    playWrapperFixed () {
      if (this.$refs.singerDetail.scrollTop >= 165) {
        this.fixed = true // 暂时不重构
      } else {
        this.fixed = false
      }
    },
    back () {
      this.$router.push('/singer')
    },
    showMoreTrigger () {
      this.singerDescShow = !this.singerDescShow
    },
    selectItem (song, index) {
      this.selectPlay({
        list: this.songs,
        index
      })
    },
    ...mapActions([
      'selectPlay'
    ])
  },
  components: {
    loading
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable.styl'
@import '~common/stylus/mixin.styl'

.singer-detail
  position: absolute // 原本是设置为fixed，这样下面的fixed就会出现抖动的bug，改为absolute就好了
  margin-top: -88px // 向上覆盖导航栏 
  z-index: 100
  top: 0
  left: 0
  right: 0
  bottom: 0
  background: $color-background
  overflow auto
  -webkit-overflow-scrolling: touch
  .back
    position absolute
    top: 0
    left: 6px
    z-index: 50
    .icon-back
      display: block
      padding: 10px
      font-size: $font-size-large-x
      color: $color-theme
  .detail-head
    position: relative
    width: 100%
    .info
      padding: 40px 16px 0 16px
      width: 100%
      box-sizing: border-box
      background: #3c3c3c
      padding-bottom: 60px // 留出空间防止fixed的时候脱离文档流文字向上闪
      clearfix()
      .left
        float: left
        width: 125px
        height: 125px
      .right
        float: left
        width: calc(100% - 125px - 10px)
        margin-top: 20px
        margin-left: 10px
        .title
          vertical-align: top
          margin-left: 10px
          font-size: $font-size-large
          margin-bottom: 18px
        .fans
          margin-bottom: 15px
        .desc
          no-wrap()
          width: 100%
    .playWrapper
      position: absolute
      bottom: 0
      z-index: 200
      width: 100%
      height: 60px
      overflow: hidden
      background: #3c3c3c
      transform: translateZ(0)
      &.fixed
        position: fixed
        top: 0
        left: 0
      .play
        position: absolute
        top: 50%
        left: 50%
        transform: translate(-50%, -50%)
        box-sizing: border-box
        width: 135px
        padding: 7px 0
        text-align: center
        border: 1px solid $color-theme
        color: $color-theme
        border-radius: 100px
        font-size: 0
        .icon-play
          display: inline-block
          vertical-align: middle
          margin-right: 6px
          font-size: $font-size-medium-x
        .text
          display: inline-block
          vertical-align: middle
          font-size: $font-size-small
  .container
    margin-left: 20px
    z-index: inherit // 防止滑动点透滑动bug
    .song
      margin-top: 20px
      &:last-child
        margin-bottom: 20px
      .name
        margin-bottom: 10px
        color: $color-text
      .description
        no-wrap()
        color: $color-text-d
        font-size: $font-size-medium
  .singerDesc
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 0
    z-index: 300
    .filter
      background: rgba(7, 17, 27, 0.7)
      width: 100%
      height: 100%
    .main
      position: absolute
      top: 50%
      left: 50%
      transform: translate(-50%, -50%)
      width: 80%
      height: 80%
      background: $color-background
      padding-bottom: 50px
      border-radius: 4px
      border-top: 4px solid $color-theme
      border-bottom: 4px solid $color-background // 为了覆盖border-bottom产生的黄色毛边bug
      box-sizing: border-box
      overflow: hidden
      .text
        overflow: auto
        -webkit-overflow-scrolling: touch
        height: 100%
        padding: 20px
        padding-bottom: 0
        box-sizing: border-box
        color: $color-text-l
      .close
        text-align: center
        height: 40px
        line-height: 44px
        border-top: 1px solid rgba(255, 255, 255, 0.23)
        margin-top: 10px
</style>

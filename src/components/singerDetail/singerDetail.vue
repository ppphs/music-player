<template>
  <div class="singer-detail" :style="translateY" @touchstart="detailTouchstart" @touchmove="detailTouchmove" ref="singerDetail">
    <div class="back">
      <i class="icon-back"></i>
    </div>
    <div class="bg-image" :style="bgImage" ref="bgImage">
      <h1 class="title">{{ detailSinger.name }}</h1>
      <div class="play-wrapper">
        <div class="play">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <ul class="wrapper" ref="wrapper">
      <li v-for="(song, index) in songs" :key="index" class="song">
        <h2 class="name">{{ song.name }}</h2>
        <div class="description">{{ `${song.singer}${song.albumdesc ? (' · ' + song.albumdesc) : ''}` }}</div>
      </li>
    </ul>
  </div>
</template>

<script>
import {getSingerDetail} from 'api/singer.js'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'

export default {
  data () {
    return {
      songs: [],
      detailY: 0
    }
  },
  props: {
    detailSinger: {
      type: Object
    }
  },
  computed: {
    bgImage () {
      return `background: url(${this.detailSinger.avatar})`
    },
    translateY () {
      return `transform: translateY(${this.detailY}px);`
    }
  },
  created () {
    if (this.$store.state.detailId === 0) { // 用户在详情页刷新就会直接回到歌手页
      this.$router.push('/singer')
    }
    this._getSingerDetail()
  },
  mounted () {
    this.maxTranslateY = this.$refs.bgImage.clientHeight - 62 // 可以向上translate的最大距离
    this.$refs.singerDetail.style.height = `calc(100% + ${this.maxTranslateY}px)`
    this.$refs.wrapper.addEventListener('scroll', this.preventDefault, false)
  },
  methods: {
    _getSingerDetail () {
      getSingerDetail(this.$store.state.detailId).then(res => {
        if (res.code === ERR_OK) {
          this.songs = this.normalizeSongData(res.data.list)
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
    detailTouchstart (e) {
      // this.oldPosition = e.changedTouches[0].clientY
    },
    detailTouchmove (e) {
      // let position = e.changedTouches[0].clientY
      // console.log(position)
      // let delta = position - this.oldPosition // 两次移动位置的差值
      // if (delta < 0 && this.detailY >= -this.maxTranslateY) {
      //   console.log('向上滑')
      //   // console.log(this.$refs.bgImage.clientHeight)
      //   // console.log(this.$refs.singerDetail.style.transform)
      //   console.log(this.$refs.wrapper)
      //   this.detailY += delta
      //   return
      // } else if (delta > 0 && this.detailY < 0) {
      //   console.log('向下滑')
      //   this.detailY += delta
      //   return
      // }
      // this.$refs.wrapper.removeEventListener('scroll', this.preventScroll, false)
    },
    preventScroll (e) {
      e.preventDefault
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable.styl'
@import '~common/stylus/mixin.styl'

.singer-detail
  position: fixed
  z-index: 100
  top: 0
  left: 0
  right: 0
  background: $color-background
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
  .title
    position: absolute
    top: 0
    left: 50%
    transform: translateX(-50%)
    font-size: $font-size-large
    color: $color-text
    margin-top: 15px
    z-index: 10
  .bg-image
    position: relative
    width: 100%
    height: 0
    padding-top: 70%
    .play-wrapper
      position: absolute
      bottom: 15px
      z-index: 50
      width: 100%
      .play
        box-sizing: border-box
        width: 135px
        padding: 7px 0
        margin: 0 auto
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
    .filter
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      background: rgba(7, 17, 27, 0.4)
  .wrapper
    margin-left: 20px
    .song
      margin-top: 20px
      .name
        margin-bottom: 10px
        color: $color-text
      .description
        no-wrap()
        color: $color-text-d
        font-size: $font-size-medium
</style>

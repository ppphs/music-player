<template>
  <div class="recommend" ref="wrapper">
    <swiper class="swiper-container" :options="swiperOption" ref="swiperContainer" width="100%">
      <swiper-slide :key="item.id" v-for="item in recommends" v-html="_setImage(item.linkUrl, item.picUrl)"></swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
      <div class="swiper-button-prev" slot="button-prev"></div>
      <div class="swiper-button-next" slot="button-next"></div>
    </swiper>
    <div class="songList-wrapper">
      <h1 class="list-title">热门歌单推荐</h1>
      <ul>
        <li :key="item.dissid" v-for="item in songList" class="item">
          <div class="icon">
            <img v-lazy="item.imgurl" :alt="item.dissname" width="60px" height="60px">
          </div>
          <div class="text">
            <h2 class="name" v-html="item.creator.name"></h2>
            <p class="desc" v-html="item.dissname"></p>
          </div>
        </li>
      </ul>
      <div class="loading-container" v-show="!songList.length">
        <loading></loading>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {getRecommend, getSongList} from '@/api/recommend.js'
import {ERR_OK} from '@/api/config.js'
import Loading from '@/base/loading/loading'

export default {
  data () {
    return {
      swiperOption: {
        pagination: '.swiper-pagination',
        paginationClickable: true,
        spaceBetween: 0,
        centeredSlides: true,
        autoplay: 2500,
        autoplayDisableOnInteraction: true,
        loop: true
      },
      recommends: [],
      songList: []
    }
  },
  created () {
    this._getRecommend()
    this._getSongList()
  },
  beforeRouteEnter (to, from, next) { // 解决组件切换scrollTop被重置
    next(vm => {
      vm.$refs.wrapper.scrollTop = vm.$store.state.recommendScrollTop
    })
  },
  beforeRouteLeave (to, from, next) {
    let payload = {
      name: 'recommend',
      position: this.$refs.wrapper.scrollTop
    }
    this.$store.commit('saveScrollTop', payload)
    next()
  },
  methods: {
    _getRecommend () {
      getRecommend().then((res) => {
        if (res.code === ERR_OK) {
          this.recommends = res.data.slider
        }
      })
    },
    _getSongList () {
      getSongList().then((res) => {
        if (res.code === ERR_OK) {
          this.songList = res.data.list
        }
      })
    },
    _setImage (linkUrl, picUrl) {
      return `<a href="${linkUrl}"><img class="img" src="${picUrl}" alt="推荐滚动图片" width="100%" height="${parseInt(document.body.clientWidth * 0.4)}"></a>`
    }
  },
  components: {
    Loading
  }
}
</script>

<style lang="stylus">
@import '~common/stylus/variable.styl'
  .recommend
    position: absolute
    top: 88px
    bottom: 0
    width: 100%
    overflow: auto
    -webkit-overflow-scrolling: touch
    .swiper-container
      .swiper-pagination-bullet
        background: rgba(144,144,144,.8)
        &.swiper-pagination-bullet-active
          background: #ffffff
      .swiper-button-next
        background-image: none
      .swiper-button-prev
        background-image: none
    .songList-wrapper
      position: relative
      .list-title
        height: 65px
        line-height: 65px
        text-align: center
        font-size: $font-size-medium
        color: $color-theme
      .item
        display: flex
        box-sizing: border-box
        align-items: center
        padding: 0 20px 20px 20px
        .icon
          flex: 0 0 60px
          width: 60px
          padding-right: 20px
        .text
          display: flex
          flex-direction: column
          justify-content: center
          flex: 1
          line-height: 20px
          overflow: hidden
          font-size: $font-size-medium
          .name
            margin-bottom: 10px
            color: $color-text
          .desc
            color: $color-text-d
      .loading-container
        position: fixed
        top: 47%
        width: 100%
        transform: translateY(-50%)
</style>

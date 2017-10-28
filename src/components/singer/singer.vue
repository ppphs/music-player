<template>
  <div class="rank">
    <ul class="wrapper" id="wrapper" ref="wrapper" @scroll="wrapperScroll">
      <li class="item" :nav-title="singerItem.title.slice(0, 1)" v-for="(singerItem, index) in singers" :key="index">
        <h2 class="title">{{ singerItem.title }}</h2>
        <div @click="showDetail(singer.id)" class="singer" v-for="(singer, singerIndex) in singerItem.items" :key="singerIndex">
          <div class="avatar">
            <img v-lazy="singer.avatar" :alt="singer.name">
          </div>
          <div class="name">{{ singer.name }}</div>
        </div>
      </li>
    </ul>
    <nav class="initialList" @touchstart="oninitialListTouchStart" @touchmove.stop.prevent="oninitialListTouchMove">
      <ul>
        <li :class="[{item: true}, {highLight: initialHighLight[index]}]" v-for="(text, index) in titleName" :key="index">{{ text }}</li>
      </ul>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import getSingerList from 'api/singer.js'
import {ERR_OK} from 'api/config.js'
import Singer from 'common/js/singer.js'
import Vue from 'vue'

const HOT_SINGER_LENGTH = 10

export default {
  data () {
    return {
      singers: [],
      titleName: ['热'],
      initialHighLight: [true, false] // 先加入热门和其他类
    }
  },
  created () {
    this._getSingerList()
  },
  beforeRouteEnter (to, from, next) { // 解决组件切换scrollTop被重置
    next(vm => {
      vm.$refs.wrapper.scrollTop = vm.$store.state.singerScrollTop
    })
  },
  beforeRouteLeave (to, from, next) {
    let payload = {
      name: 'singer',
      position: this.$refs.wrapper.scrollTop
    }
    this.$store.commit('saveScrollTop', payload)
    next()
  },
  methods: {
    _getSingerList () {
      getSingerList().then((res) => {
        if (res.code === ERR_OK) {
          this.singers = this._normalizeSingerList(res.data.list)
          this.$nextTick(function () { // 更新了数据要等到dom更新之后才能调用
            this.initHeightArr() // 先要初始化高度再去代理
            this.proxyWrapper() // 代理wrapper dom
          })
        }
      })
    },
    _normalizeSingerList (list) { // 数组化数据
      let map = {
        hot: {
          title: '热门',
          items: []
        }
      }
      list.forEach((item, index) => {
        let key = item.Findex
        if (index < HOT_SINGER_LENGTH) {
          map.hot.items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        }
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(new Singer({
          id: item.Fsinger_mid,
          name: item.Fsinger_name
        }))
      })

      // 变为数组顺序排列，第一位是hot最后一位是其他
      let sortArr = [map.hot] // 第一位是hot数组
      for (let i = 65; i < 91; i++) {
        let key = String.fromCharCode(i)
        if (key in map) {
          sortArr.push(map[key])
          this.titleName.push(key)
          this.initialHighLight.push(false) // 高亮开关
        }
      }
      map['9'].title = '#'
      sortArr.push(map['9'])
      this.titleName.push('#')
      return sortArr
    },
    move (text) {
      let targetItem = document.querySelector(`[nav-title="${text}"]`)
      let positionY = targetItem.getBoundingClientRect().top - 88 // 这里要减去顶部图标和导航栏的高度
      let wrapper = document.querySelector('.wrapper')
      wrapper.scrollTop += positionY // 这里必须加上视口滚动了多少，因为positionY是元素相对于视口左上角的0，0点的
    },
    oninitialListTouchStart (e) {
      this.move(e.target.textContent)
    },
    oninitialListTouchMove (e) {
      let positionY = e.changedTouches[0].clientY
      let currentItem = document.elementFromPoint(document.documentElement.clientWidth - 1, positionY)
      if (currentItem.nodeName === 'UL') {
        return
      }
      this.move(currentItem.textContent)
    },
    wrapperScroll () {
      this.proxyWrapperObj.scrollTop = this.$refs.wrapper.scrollTop
    },
    initHeightArr () {
      this.heightArr = []
      let itemList = document.querySelectorAll('[nav-title]')
      for (let i = 0, len = itemList.length; i < len; i++) {
        this.heightArr.push(itemList[i].getBoundingClientRect().top - 88)
      }
    },
    proxyWrapper () {
      let that = this
      this.proxyWrapperObj = new Proxy(that.$refs.wrapper, {
        get (target, propKey, receiver) {
          return target[propKey]
        },
        set (target, key, value, receiver) {
          let arr = that.heightArr
          if (key === 'scrollTop') {
            for (let i = 0, len = arr.length; i < len; i++) {
              if (i !== (len - 1) && (value >= arr[i] && value < arr[i + 1])) {
                that.initialHighLight.fill(false) // 把全部置为false
                Vue.set(that.initialHighLight, i, true)
                break
              } else if (value > 0) {
                that.initialHighLight.fill(false) // 遍历到最后一个元素
                Vue.set(that.initialHighLight, i, true)
              }
            }
          }
          return Reflect.set(target, key, value, receiver)
        }
      })
      // this.$refs.wrapper = proxyWrapperObj // 不能覆盖原生的dom因为这样在beforeRouteEnter时候设置scrollTop会失败
    },
    showDetail (id) {
      this.$router.push(`/singer/${id}`)
    }
  }
}
</script>

<style lang="stylus">
@import '~common/stylus/variable.styl'

.rank
  position: absolute
  top: 88px
  bottom: 0
  .wrapper
    -webkit-overflow-scrolling: touch
    height: 100%
    overflow: auto
    .item
      color: $color-text-ll
      .title
        position: sticky
        top: 0 // 要设置top的值不然无效
        height: 28px
        padding-left: 10px
        background: rgb(50, 50, 50)
        font-size: $font-size-small
        line-height: 28px
      .singer
        display: flex
        padding: 20px 0 0 20px
        height: 60px
        align-items: center
        &:last-child
          padding-bottom: 20px
        .avatar
          flex: 0 0 50px
          img
            border-radius: 50%
            height: 50px
            width: 50px
        .name
          flex: 1
          font-size: $font-size-medium-x
          padding-left: 20px
          line-height: 60px
  .initialList
    position: absolute
    top: 35px
    right: 0
    bottom: 10px
    background: rgba(0, 0, 0, 0.2)
    border-radius: 11px
    text-align: center
    padding: 5px 0
    ul
      display: flex
      flex-direction: column
      justify-content: space-between
      height: 100%
      .item
        padding: 0 5px
        font-size: $font-size-small
      .highLight
        color: yellow
</style>

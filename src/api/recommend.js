import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config.js'
import axios from 'axios'

export function getRecommend () {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })

  return jsonp(url, data, options)
}

export function getSongList () {
  // const url = '/api/getSongList'
  // const data = Object.assign({}, commonParams, {
  //   platform: 'yqq',
  //   hpstUin: 0,
  //   sin: 0,
  //   ein: 29,
  //   sortId: 5,
  //   needNewcode: 0,
  //   categoryId: 10000000,
  //   rnd: Math.random(),
  //   format: 'json'
  // })

  // return axios.get(url, {
  //   params: data
  // }).then((res) => {
  //   return Promise.resolve(res.data)
  // })
  /**
   * 因为qq音乐的接口变了所以这里拿不到json数据了我就自己复制粘贴了一份模拟数据下来
   */
  // const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
  // const data = Object.assign({}, commonParams, {
  //   platform: 'yqq',
  //   hostUin: 0,
  //   sin: 0,
  //   ein: 29,
  //   sortId: 5,
  //   needNewCode: 0,
  //   categoryId: 10000000,
  //   rnd: Math.random(),
  //   jsonpCallback: 'getPlaylist',
  //   loginUin: 0
  // })
  // return jsonp(url, data, {
  //   param: 'getPlaylist'
  // })
  const url = '/api/getSongList'

  return axios.get(url).then((res) => {
    return Promise.resolve(res.data)
  })
}

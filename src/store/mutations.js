import * as types from './mutation-types'

const mutations = {
  saveScrollTop (state, payload) {
    state[payload.name + 'ScrollTop'] = payload.position
  },
  showDetail (state, id) {
    state.detailId = id
  },
  [types.SET_PLAYING_STATE] (state, flag) { // 使用mutation-types简写名称
    state.playing = flag
  },
  [types.SET_PLAYLIST] (state, list) {
    state.playList = list
  },
  [types.SET_FULL_SCREEN] (state, flag) {
    state.fullScreen = flag
  },
  [types.SET_PLAYING_STATE] (state, flag) {
    state.playing = flag
  },
  [types.SET_SEQUENCE_LIST] (state, list) {
    state.sequenceList = list
  },
  [types.SET_PLAY_MODE] (state, mode) {
    state.mode = mode
  },
  [types.SET_CURRENT_INDEX] (state, index) {
    state.currentIndex = index
  }
}

export default mutations

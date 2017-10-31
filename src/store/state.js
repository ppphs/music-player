import {playMode} from 'common/js/config'

const state = {
  recommendScrollTop: 0,
  singerScrollTop: 0,
  detailId: 0,
  playing: false,
  fullScreen: false,
  playList: [],
  sequenceList: [],
  mode: playMode.sequence,
  currentIndex: -1
}

export default state

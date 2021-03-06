export const playing = state => state.playing

export const fullScreen = state => state.fullScreen

export const playList = state => {
  console.log(state.playList)
  return state.playList
}

export const sequenceList = state => state.sequenceList

export const mode = state => state.mode

export const currentIndex = state => state.currentIndex

export const currentSong = state => (state.playList[state.currentIndex] || {})

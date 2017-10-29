const mutations = {
  saveScrollTop (state, payload) {
    state[payload.name + 'ScrollTop'] = payload.position
  },
  showDetail (state, id) {
    state.detailId = id
  }
}

export default mutations

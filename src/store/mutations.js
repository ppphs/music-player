const mutations = {
  saveScrollTop (state, payload) {
    state[payload.name + 'ScrollTop'] = payload.position
  }
}

export default mutations

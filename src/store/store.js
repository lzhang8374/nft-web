import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const state={
    dictList: localStorage.getItem('state') ? JSON.parse(localStorage.getItem('state')) : []
}
const mutations={
    ADD_DIC_DATA_ITEMS(state, items){
      state.dictList = items
    }

}
const actions={
       getDictValueList({ commit }) {
              this.$http.get("api/dictvalue/getDictList").then((res => {
                if(res.code == 0){
                  commit('ADD_DIC_DATA_ITEMS', res.data)
                }
              }))
          }

}
const getters={
    getDictByType: (state) => (type) =>
        {
            return state.dictList.find(item => item.dictType === type);
        }
}
const store=new Vuex.Store({
    state,
    getters,
    mutations,
    actions,
    // namespaced: true
})
export default store

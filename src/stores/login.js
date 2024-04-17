import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    userInfo: {
      juese: ''
    }
  }),
  actions: {
    setUserInfo(userInfo) {
      this.userInfo = userInfo;
    }
  }
})

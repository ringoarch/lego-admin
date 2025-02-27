import {
  systemInfoGetAPI
} from '@/api/admin/config'
import { headerModelListAPI, headerModelAllListAPI } from '@/api/config'
import Lockr from 'lockr'

/** 记录 侧边索引 */
const app = {
  state: {
    logo: '',
    name: '',
    sidebar: {
      activeIndex: 160, // 目前激活的 行
      collapse: Lockr.get('sideBarCollapse') || false
    },
    navbar: {
      activeIndex: '' // 导航目前是第几个 个人中心需要
    },
    // 图片缓存
    imageCache: {},
    headerModule: null, // 置顶模块
    allModule: null
  },

  mutations: {
    SET_ACTIVEINDEX: (state, index) => {
      let currentIndex = state.sidebar.activeIndex + index
      if (currentIndex < 160 || currentIndex > 900) {
        currentIndex = 160
      }
      state.sidebar.activeIndex = currentIndex
    },
    SET_COLLAPSE: (state, collapse) => {
      state.sidebar.collapse = collapse
      Lockr.set('sideBarCollapse', collapse)
    },
    SET_NAVACTIVEINDEX: (state, path) => {
      state.navbar.activeIndex = path
    },
    SET_APPLOGO: (state, logo) => {
      state.logo = logo
    },
    SET_APPNAME: (state, name) => {
      state.name = name
    },
    SET_IMAGECACHE: (state, value) => {
      state.imageCache = value
    }
  },

  actions: {
    GetSystemInfo({
      commit
    }) {
      return new Promise((resolve, reject) => {
        systemInfoGetAPI().then(response => {
          const resData = response.data || {}
          commit('SET_APPNAME', resData.companyName)
          commit('SET_APPLOGO', resData.companyLogo)
          Lockr.set('systemLogo', resData.companyLogo)
          Lockr.set('systemName', resData.companyName)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 所有可选应用
    GetAllModule({ commit, state }) {
      return new Promise((resolve, reject) => {
        headerModelAllListAPI().then(response => {
          state.allModule = response.data
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 置顶应用
    GetHeaderModule({ commit, state }) {
      return new Promise((resolve, reject) => {
        headerModelListAPI().then(response => {
          state.headerModule = response.data
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default app

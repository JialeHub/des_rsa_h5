import axios from 'axios'
import router from '@/router'
import store from '@/store'

const service = axios.create({
  timeout: 30000,
  baseURL: process.env.VUE_APP_BASE_API,
  withCredentials: true
})

// 请求拦截
service.interceptors.request.use(
  config => {
    const token = store.getters.token
    const url = config.url
    if (isAddToken(url)) config.headers.Authorization = token
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截
service.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    const { status } = error.response.data
    if (status === 404) {
      router.push({ name: 'error404' }).then()
    } else if (status === 403) {
      router.push({ name: 'error403' }).then()
    }
    return Promise.reject(error)
  }
)

/**
 * @description 白名单，添加token的接口
 * */
const isAddToken = (url) =>[].some(item => url === item)

export default service

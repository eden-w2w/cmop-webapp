import axios from 'axios'
import Adapter from 'axios-mock-adapter'
import { get } from 'lodash'
import util from '@/libs/util'
import { errorLog, errorCreate } from './tools'

/**
 * @description 创建请求实例
 */
function createService() {
    // 创建一个 axios 实例
    const service = axios.create()
    // 请求拦截
    service.interceptors.request.use(
        config => config,
        error => {
            // 发送失败
            console.log(error)
            return Promise.reject(error)
        }
    )
    // 响应拦截
    service.interceptors.response.use(
        response => {
            const status = response.status
            if (status >= 400) {
              const { msg, canBeTalkError } = response.data
              if (canBeTalkError !== undefined && canBeTalkError) {
                errorCreate(msg)
              }
            }
            return response.data
        },
        error => {
            const { msg, canBeTalkError } = get(error, 'response.data')
            if (canBeTalkError !== undefined && canBeTalkError) {
              error.message = msg
              errorLog(error)
              return Promise.reject(error)
            }
            const status = get(error, 'response.status')
            switch (status) {
              case 400: error.message = '请求错误'; break
              case 401: error.message = '未授权，请登录'; break
              case 403: error.message = '拒绝访问'; break
              case 404: error.message = `请求地址未找到: ${error.response.config.url}`; break
              case 408: error.message = '请求超时'; break
              case 500: error.message = '服务器内部错误'; break
              case 501: error.message = '服务未实现'; break
              case 502: error.message = '网关错误'; break
              case 503: error.message = '服务不可用'; break
              case 504: error.message = '网关超时'; break
              case 505: error.message = 'HTTP版本不受支持'; break
              default: break
            }
            errorLog(error)
            return Promise.reject(error)
        }
    )
    return service
}

/**
 * @description 创建请求方法
 * @param {Object} service axios 实例
 */
function createRequestFunction(service) {
    return function (config) {
        const token = util.cookies.get('token')
        const configDefault = {
            headers: {
                Authorization: token,
                'Content-Type': get(config, 'headers.Content-Type', 'application/json')
            },
            timeout: 10000,
            baseURL: process.env.VUE_APP_API,
            data: {}
        }
        return service(Object.assign(configDefault, config))
    }
}

// 用于真实网络请求的实例和请求方法
export const service = createService()
export const request = createRequestFunction(service)

// 用于模拟网络请求的实例和请求方法
export const serviceForMock = createService()
export const requestForMock = createRequestFunction(serviceForMock)

// 网络请求数据模拟工具
export const mock = new Adapter(serviceForMock)
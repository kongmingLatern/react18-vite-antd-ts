import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { message } from 'antd'
import axios from 'axios'

interface HttpClientConfig extends AxiosRequestConfig {
  baseURL?: string
  timeout?: number
  headers?: Record<string, string>
}

class HttpClient {
  private instance: AxiosInstance

  constructor(config: HttpClientConfig = {}) {
    this.instance = axios.create({
      baseURL: config.baseURL || '',
      timeout: config.timeout || 1000000,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
      ...config,
    })

    this.setupInterceptors()
  }

  private handleResponseError(status: number, error: any) {
    switch (status) {
      case 401:
        message.error('权限不足')
        break
      case 403:
        message.error('禁止访问')
        break
      case 404:
        message.error(`请求的资源不存在,地址: ${error.config.url}`)
        break
      default:
        message.error('请求失败')
        break
    }
    return Promise.reject(error)
  }

  private setupInterceptors(): void {
    this.instance.interceptors.request.use(
      (config) => {
        // You can modify the request config here (e.g., add auth tokens)
        return config
      },
      (error) => {
        return Promise.reject(error)
      },
    )

    this.instance.interceptors.response.use(
      (response) => {
        // You can modify the response data here
        return response
      },
      (error) => {
        return this.handleResponseError(error.response?.status, error)
      },
    )
  }

  public async request<T = any>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.instance.request(config)
      return response.data
    }
    catch (error) {
      return Promise.reject(error)
    }
  }

  public get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'GET', url })
  }

  public post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'POST', url, data })
  }

  public put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'PUT', url, data })
  }

  public delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'DELETE', url })
  }

  public patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'PATCH', url, data })
  }

  public export<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'GET', url, responseType: 'blob', params: data })
  }

  public upload<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'POST', url, data, responseType: 'blob' })
  }
}

const http = new HttpClient({
  baseURL: '/api',
})
export { http }

export const httpGet = http.get.bind(http)
export const httpPost = http.post.bind(http)
export const httpPut = http.put.bind(http)
export const httpDelete = http.delete.bind(http)
export const httpPatch = http.patch.bind(http)
export const httpExport = http.export.bind(http)
export const httpUpload = http.upload.bind(http)

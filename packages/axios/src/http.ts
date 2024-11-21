import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
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
      timeout: config.timeout || 10000,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
      ...config,
    })

    this.setupInterceptors()
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
        // Handle errors (e.g., refresh token, redirect to login)
        return Promise.reject(error)
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

const http = new HttpClient()
export { http }

export const httpGet = http.get.bind(http)
export const httpPost = http.post.bind(http)
export const httpPut = http.put.bind(http)
export const httpDelete = http.delete.bind(http)
export const httpPatch = http.patch.bind(http)
export const httpExport = http.export.bind(http)
export const httpUpload = http.upload.bind(http)

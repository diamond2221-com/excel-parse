import type { RequestConfig } from '@/shime-uni';
import qs from 'qs';
import { handleResponse, showToast } from './interceptor';
/** 请求配置KEY */
/* const REQUEST_CONFIG_KETS = [
  'baseURL', 'url', 'data', 'params', 'header', 'timeout', 'method',
  'dataType', 'responseType', 'enableHttp2', 'enableQuic',
  'enableCache', 'enableHttpDNS', 'httpDNSServiceId'
] */

/** 请求默认配置 */
const REQUEST_DEFAULT_CONFIG: RequestConfig = {
  baseURL: '', // 开发者服务器地址
  url: '', // 开发者服务器接口地址 | 接口地址
  method: 'GET', // HTTP 请求方法
  params: undefined, // Get | Delete 请求的参数
  data: undefined, // Post | Put 请求的参数
  header: {
    'Content-Type': 'application/json; charset=UTF-8'
  }, // 请求头
  dataType: 'json', // 返回的数据格式
  responseType: 'text', // 响应的数据类型
  enableHttp2: false, // 开启 http2
  enableQuic: false, // 开启 quic
  enableCache: false, // 开启 cache
  enableHttpDNS: false, // 是否开启 HttpDNS 服务。如开启，需要同时填入 httpDNSServiceId
  httpDNSServiceId: false, // HttpDNS 服务商 Id
  timeout: 10 * 3000 // 超时时间10s
  // getRequestTask         // 将当前请求的 RequestTask 作为参数传递进去，默认无此项，需手动设置此项方法
};

type RequestInterceptorFulfilled = (config: RequestConfig) => Promise<RequestConfig> | RequestConfig;
type RequestInterceptorRejected = (error: any) => Promise<never>;
type RequestInterceptorHandle = {
  fulfilled: RequestInterceptorFulfilled
  rejected: RequestInterceptorRejected
}

type ResponseResult<T> = UniApp.RequestSuccessCallbackResult & {
  data: T
}
type ResponseInterceptorFulfilled<T = string | AnyObject | ArrayBuffer> = (response: ResponseResult<T>) => Promise<T>
type ResponseInterceptorRejected = (error: any) => any;
type ResponseInterceptorHandle<T = any> = {
  fulfilled: ResponseInterceptorFulfilled<T>
  rejected: ResponseInterceptorRejected
}


/** 拦截器 */
class RequestInterceptor {
  handlers: Array<RequestInterceptorHandle> = []

  constructor() {
    this.handlers = [];
  }

  use(fulfilled: RequestInterceptorFulfilled, rejected: RequestInterceptorRejected) {
    this.handlers[0] = ({ fulfilled, rejected });
  }

  forEach(fn: (handler: RequestInterceptorHandle, index: number, handlers: Array<RequestInterceptorHandle>) => void) {
    for (let i = 0, l = this.handlers.length; i < l; i++) {
      fn.call(null, this.handlers[i], i, this.handlers);
    }
  }
}

class ResponseInterceptor {
  handlers: Array<ResponseInterceptorHandle> = []

  constructor() {
    this.handlers = [];
  }

  use<T>(fulfilled: ResponseInterceptorFulfilled<T>, rejected: ResponseInterceptorRejected) {
    this.handlers[0] = ({ fulfilled, rejected });
  }

  forEach<T>(fn: (handler: ResponseInterceptorHandle<T>, index: number, handlers: Array<ResponseInterceptorHandle<T>>) => void) {
    for (let i = 0, l = this.handlers.length; i < l; i++) {
      fn.call(null, this.handlers[i], i, this.handlers);
    }
  }

}

/** 合并配置 */
const mergeConfig = (defaultConfig: RequestConfig, config: Partial<RequestConfig>) => {
  // 得到默认配置
  const requestConfig = { ...defaultConfig };
  type RequestConfigKey = keyof RequestConfig

  for (const key in config) {
    if (key in defaultConfig) {
      if (Array.isArray(config)) {
        requestConfig[key as RequestConfigKey] = Object.assign([], defaultConfig[key as RequestConfigKey], config[key as RequestConfigKey]);
      } else if (config[key as RequestConfigKey] instanceof Object) {
        requestConfig[key as RequestConfigKey] = Object.assign({}, defaultConfig[key as RequestConfigKey], config[key as RequestConfigKey]);
      } else {
        requestConfig[key as RequestConfigKey] = config[key as RequestConfigKey] ? config[key as RequestConfigKey] : defaultConfig[key as RequestConfigKey];
      }
    } else {
      requestConfig[key as RequestConfigKey] = config[key as RequestConfigKey];
    }
  }

  return requestConfig;
};

// 接口请求
export default class Request {
  interceptors = {
    // 拦截器
    request: new RequestInterceptor(),
    response: new ResponseInterceptor()
  }
  requestMap = new Map() // 请求集合
  default: RequestConfig = {
    ...mergeConfig(REQUEST_DEFAULT_CONFIG, {})
  } // 默认配置

  // url地址传参
  get(url: string, requestConfig: any) {
    const config = { ...requestConfig, method: 'get', url };
    return this.request(config);
  }
  // url地址传参
  delete(url: string, requestConfig: any) {
    const config = { ...requestConfig, method: 'delete', url };
    return this.request(config);
  }
  // url地址传参
  head(url: string, requestConfig: any) {
    const config = { ...requestConfig, method: 'head', url };
    return this.request(config);
  }
  // 请求体传参
  post(url: string, data: any, requestConfig: any) {
    const config = { data, ...requestConfig, method: 'post', url };
    return this.request(config);
  }
  // 请求体传参
  put(url: string, data: any, requestConfig: any) {
    const config = { data, ...requestConfig, method: 'put', url };
    return this.request(config);
  }
  // 请求体传参
  patch(url: string, data: any, requestConfig: any) {
    const config = { data, ...requestConfig, method: 'patch', url };
    return this.request(config);
  }

  constructor(config: Partial<RequestConfig>) {
    this.default = mergeConfig(REQUEST_DEFAULT_CONFIG, config); // 默认配置
  }

  /** 获取请求参数拼接的 Key */
  getRequestKey(config: RequestConfig) {
    return [config.method, config.url, JSON.stringify(config.params), JSON.stringify(config.data)].join('&');
  }

  /** 创建一个新请求实例 */
  create(requestConfig: RequestConfig) {
    return new Request(requestConfig);
  }

  /**
   * 发送一个请求
   * @param {Object} config (这个请求的配置用于与 this.defaults 合并)
   */
  request<T, Response = {
    data: T,
    code: number,
    message: string
  }>(config: RequestConfig): Promise<Response> {
    if (typeof config === 'string') {
      config = arguments[1] || {};
      config.url = arguments[0];
    } else {
      config = config || {};
    }
    config = mergeConfig(this.default, config);

    const chain: any = [this.dispatchRequest, undefined];
    let promise = Promise.resolve(config) as Promise<Response>;

    /* 请求拦截器 */
    this.interceptors.request.use(
      (config) => {
        // 取消重复请求
        const requestKey = this.getRequestKey(config);
        const request = this.requestMap.get(requestKey);
        if (request) request.RequestTask.abort();

        // if (token) {
        //   config.header = {
        //     ...config.header,
        //     token: token || '',
        //     appKey: '39026523c0ed47778f254a10631b5e56',
        //     publicKey:
        //       '04776859e4d732cc2715fc6d89c9786913335818f73af6f50c1cc51c87b1016b212a5d4162a7fd2e27d1cb4897f58bc4f8ca737408da8903f3ecf5d61b39b42315'
        //   };
        // }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    /* 响应拦截器 */
    this.interceptors.response.use<Response>(
      (response) => {
        // 响应成功
        if (response.statusCode === 200) {
          return handleResponse<T>(response) as Promise<Response>; //Promise.resolve(response)
        } else {
          uni.hideLoading();
          return Promise.reject(new Error(response.errMsg));
        }
      },
      // 响应失败
      (error) => {
        if (error?.errMsg?.includes('abort')) {
          console.log('请求取消 >>> ', error);
        } else if (error?.errMsg?.includes('timeout')) {
          showToast('请求超时');
        } else {
          showToast('响应失败，请稍后再试!');
          // handleError(error)
        }
        return Promise.reject(error);
      }
    );

    // // 添加请求拦截器
    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
      chain.unshift(interceptor.fulfilled, interceptor.rejected);
    });
    // 添加响应拦截器
    this.interceptors.response.forEach<Response>(function pushRequestInterceptors(interceptor) {
      chain.push(interceptor.fulfilled, interceptor.rejected);
    });

    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }

    return promise;
  }

  /**
   * 使用配置的适配器将请求分发到服务器
   *
   * @param {object} config 用于请求的配置
   */
  dispatchRequest = (config: RequestConfig) => {
    return new Promise<UniApp.RequestSuccessCallbackResult>((resolve, reject) => {
      let url = config.url;
      if (!/^(http|https):\/\//.test(config.url)) {
        url = config.baseURL + config.url;
      }

      if ((['GET', 'DELETE', 'CONNECT', 'HEAD', 'OPTIONS'] as RequestConfig['method'][]).includes(config.method)) {
        config.data = config.params;
      } else {
        if (config.params) {
          const serialize = qs.stringify(config.params);
          url += /\?/.test(url) ? `&${serialize}` : `?${serialize}`;
          console.log(url)
        }
        config.data = config.data;
      }
      const requestKey = this.getRequestKey(config);
      const requestConfig = { ...config, url };
      // 请求前，先将之前请求未结束的 相同请求从队列中移出
      this.requestMap.delete(requestKey);

      const RequestTask = uni.request({
        ...requestConfig,
        success: (res) => {
          Object.assign(res, { config })
          resolve(res);
        },
        fail: (err) => {
          console.log(err);
          reject(err);
        },
        complete: () => {
          // 请求完成，无论成功还是失败，都将当前请求从队列中移出
          // 延迟500ms移除，请求结束时可能有人要使用请求队列中的数据
          setTimeout(() => {
            this.requestMap.delete(requestKey);
          }, 500);
        }
      });

      // 请求队列中不存在，则将其添加进去
      if (!this.requestMap.has(requestKey)) {
        if (typeof config.getRequestTask === 'function') config.getRequestTask(RequestTask);
        this.requestMap.set(requestKey, { config, RequestTask });
      }
    });
  };
}

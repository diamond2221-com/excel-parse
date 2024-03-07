import Request from './request';
import baseURL from './base'

const instance = new Request( {
  baseURL: baseURL,
  timeout: 50 * 1000
} );

// // 添加拦截器
// addInterceptor( instance )

export default instance;


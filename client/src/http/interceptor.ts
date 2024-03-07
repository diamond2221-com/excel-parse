// import { tokenStorage } from '@/utils/storage';

// 处理响应成功数据
export function handleResponse<T, R extends { code: number, message: string, data: T } = { code: number, message: string, data: T }>(response: UniApp.RequestSuccessCallbackResult) {
  const res = response.data as R;
  if (res.code !== 200) {
    uni.hideLoading();
    if (res.code == 401) { // 授权登录绑定
      uni.navigateTo({ url: '/pages/authorize/login/index?type=2' })
    } else if (res.code == 405) { // 重新登录
      // store.dispatch('user/wxLogin').catch(() => {
      //   uni.reLaunch({ url: '/pages/home/index' });
      // });
    } else if (res.message || res.code) {
      showToast(res.message || `Error ${res.code}`);
    }
  }

  return Promise.resolve(res);
}

// 根据响应失败，对浏览器响应状态码处理
export function handleError(response: any) {
  let msg = '';
  const { status } = response;
  switch (status) {
    case 403:
      msg = '权限不足，拒绝访问';
      break;
    case 404:
      msg = '404 资源不存在';
      break;
    case 500:
      msg = '服务器错误';
      break;
    default:
      break;
  }

  if (msg) showToast(msg);
}

//提示toast
export function showToast(msg: string) {
  uni.hideLoading();
  uni.showToast({
    icon: 'none',
    title: msg
  });
}

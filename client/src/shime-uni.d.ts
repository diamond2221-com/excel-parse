export {
  RequestConfig
}

interface RequestConfig extends UniNamespace.RequestOptions {
  url: string;
  baseURL?: any;
  data?: any;
  params?: any;
  getRequestTask?: (requestTask: UniApp.RequestTask | Promise<UniApp.RequestSuccessCallbackResult>) => void;
}

declare module "vue" {
  type Hooks = App.AppInstance & Page.PageInstance;
  interface ComponentCustomOptions extends Hooks { }
}


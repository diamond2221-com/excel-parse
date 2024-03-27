import { createSSRApp } from "vue";
import App from "./App.vue";
import TabBar from '@/components/TabBar/index.vue'
export function createApp() {
  const app = createSSRApp(App);

  app.component('TabBar', TabBar)
  return {
    app,
  };
}

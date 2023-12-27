import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VNetworkGraph from "v-network-graph"
import VueGtag from "vue-gtag"

import './index.css'
import "v-network-graph/lib/style.css"

createApp(App)
.use(router)
.use(VNetworkGraph)
.use(VueGtag, {
    config: { id: "G-TP7T2XT81G" }
})
.mount('#app')
import { createRouter, createWebHistory } from 'vue-router'
import hom from '@/views/home.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [   
    {
      path:"/",
      name:"home",
      component:hom,
    },
  ],
})

export default router

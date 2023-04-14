import { createRouter, createWebHistory } from 'vue-router';
import { useEditorStore } from '../stores/editor';
import axios from 'axios';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import PostView from '../views/PostView.vue';
import NewPostView from '../views/NewPostView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  props: ['id'],
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/post/new',
      name: 'postNew',
      component: NewPostView,
      meta: { requiresAuth: true }
    },
    {
      path: '/post/:id',
      name: 'post',
      component: PostView,
      props: true,
      meta: { requiresAuth: true }
    }
  ]
});

router.beforeEach(async (to, from) => { 
  const store = useEditorStore();

  let requiresAuth = to.matched.some(route => route.meta.requiresAuth);

  if (localStorage.getItem('token')) {
    try {
      const response = await axios.post('http://localhost:8092/auth/admin', {}, { 
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        }
      });
      if (response.status === 200) {
        store.isLoggedIn = true;
      } else {
        localStorage.removeItem('token');
        store.isLoggedIn = false;
      }
    } catch (err) {
      console.log(err);
      localStorage.removeItem('token');
      store.isLoggedIn = false;
    }
  } else {
    store.isLoggedIn = false;
  }

  console.log(store.isLoggedIn);

  if (!store.isLoggedIn && requiresAuth) {
    router.push('/login')
  }
});

export default router

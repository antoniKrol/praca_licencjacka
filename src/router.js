import { createRouter, createWebHistory } from 'vue-router';
import HelloWorld from './components/HelloWorld.vue';
import NotFound from './components/NotFound.vue'
import HandRecognition from './components/HandRecognition.vue';

const routes = [
    {
        path: '/',
        name: 'Welcome',
        component: HelloWorld
    },
    {
        path: '/hand',
        name: 'Hand',
        component: HandRecognition
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;

import {createRouter, createWebHistory} from 'vue-router';
import {authService} from '../services/AuthService';
import {urlService} from '../services/URLService';
import {watch} from 'vue';

import Home from '../views/Home.vue';
import LoginPage from '../views/Login.vue';
import RegisterPage from '../views/Register.vue';
import ProfilePage from '../views/Profile.vue';
import DeleteProfilePage from '../views/DeleteProfile.vue';
import RecoverPasswordPage from '../views/RecoverPassword.vue';
import Dashboard from '../views/Dashboard.vue';

const routes =
[
    {path: '/', component: Home},
    {
        path: '/login',
        component: LoginPage,
        beforeEnter: async (to, from, next) =>
        {
            await new Promise(resolve =>
            {
                if (authService.authInitialized.value)
                {
                    resolve(true);
                    return;
                }
                const unwatch = watch(authService.authInitialized, (initialized) =>
                {
                    if (initialized)
                    {
                        unwatch();
                        resolve(true);
                    }
                });
            });
            if (!authService.isAuthenticated()) next();
            else next('/dashboard');
        }
    },
    {
        path: '/register',
        component: RegisterPage,
        beforeEnter: async (to, from, next) =>
        {
            await new Promise(resolve =>
            {
                if (authService.authInitialized.value)
                {
                    resolve(true);
                    return;
                }
                const unwatch = watch(authService.authInitialized, (initialized) =>
                {
                    if (initialized)
                    {
                        unwatch();
                        resolve(true);
                    }
                });
            });

            if (!authService.isAuthenticated()) next();
            else next('/dashboard');
        },
    },
    {
        path: '/profile',
        component: ProfilePage,
        meta: {requiresAuth: true}
    },
    {
        path: '/delprofile',
        component: DeleteProfilePage,
        meta: { requiresAuth: true }
    },
    {path: '/recoverpass', component: RecoverPasswordPage},
    {
        path: '/dashboard',
        component: Dashboard,
        meta: {requiresAuth: true}
    },
];

const router = createRouter({history: createWebHistory(), routes});
router.beforeEach(async (to, from, next) =>
{
    if (!authService.authInitialized.value)
    {
        await new Promise(resolve =>
        {
            const unwatch = watch(authService.authInitialized, (initialized) =>
            {
                if (initialized)
                {
                    unwatch();
                    resolve(true);
                }
            });
        });
    }

    if (to.meta.requiresAuth && !authService.isAuthenticated()) next('/login');
    else next();
});

urlService.initialize(router);
export default router;
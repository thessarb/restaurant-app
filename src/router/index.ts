import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import TabsPage from "@/views/TabsPage.vue";
import { useAuthStore } from "@/stores/authStore";
import { Network } from '@capacitor/network';

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        redirect: "/tabs/events",
    },
    {
        path: "/register",
        name: "register",
        component: () => import("@/views/auth/Register.vue"),
    },
    {
        path: "/personalinfo",
        name: "personalinfo",
        component: () => import("@/views/auth/PersonalInfo.vue"),
    },
    {
        path: "/security",
        name: 'security',
        component: () => import("@/views/auth/Security.vue"),
    },
    {
        path: "/login",
        name: "login",
        component: () => import("@/views/auth/Login.vue"),
    },
    {
        path: "/privacy",
        name: "privacy",
        component: () => import("@/views/auth/Privacy.vue"),
        meta: { requiresAuth: true },
    },
    {
        path: "/connection",
        name: "connection",
        component: () => import("@/views/general/Connection.vue"),
    },
    {
        path: "/tabs/",
        component: TabsPage,
        children: [
            {
                path: "",
                redirect: "/tabs/events",
            },
            {
                path: "events",
                name: "events",
                component: () => import("@/views/events/List.vue"),
            },
            {
                path: "events/:id",
                name: "event",
                component: () => import("@/views/events/Detail.vue"),
            },
            {
                path: "reservations",
                name: "reservations",
                component: () => import("@/views/reservations/List.vue"),
                meta: { requiresAuth: true },
            },
            {
                path: "reservetype/:id",
                name: "reservetype",
                component: () => import("@/views/events/ReserveType.vue"),
            },
            {
                path: "reserve/:id",
                name: "reserve",
                component: () => import("@/views/events/Reserve.vue"),
                meta: { requiresAuth: true },
            },
            {
                path: "profile",
                name: "profile",
                component: () => import("@/views/auth/Profile.vue"),
                meta: { requiresAuth: true },
            },
            {
                path: "profile/personal",
                name: "personal",
                component: () => import("@/views/profile/Personal.vue"),
                meta: { requiresAuth: true },
            },
            {
                path: "profile/password",
                name: 'password',
                component: () => import("@/views/profile/Password.vue"),
                meta: { requiresAuth: true },
            },
            {
                path: "scanner",
                name: "scanner",
                component: () => import("@/views/auth/Scanner.vue"),
                meta: { requiresAuth: true },
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

const internetStatus = async () => {
    const status = await Network.getStatus();
    return status;
};

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    authStore.initialize()
        internetStatus().then((status) => {
        if (!status.connected && to.path !== "/connection") {
            next("/connection");
        } else if (to.meta.requiresAuth && !authStore.isAuthenticated) {
            next("/login");
        } else {
            next();
        }
    })
});

export default router;

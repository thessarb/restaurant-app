import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import TabsPage from "@/views/TabsPage.vue";
import { useAuthStore } from "@/stores/authStore";
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
                path: "event/:id",
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
                path: "reservation/:id",
                name: "reservation",
                component: () => import("@/views/reservations/Detail.vue"),
                meta: { requiresAuth: true },
            },
            {
                path: "profile",
                name: "profile",
                component: () => import("@/views/auth/Profile.vue"),
                meta: { requiresAuth: true },
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next("/login");
    } else {
        next();
    }
});

export default router;

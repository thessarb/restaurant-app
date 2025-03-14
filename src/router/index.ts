import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import TabsPage from "@/views/TabsPage.vue";
import Register from "@/views/Auth/Register.vue";
import PersonalInfo from "@/views/Auth/PersonalInfo.vue";
import Security from "@/views/Auth/Security.vue";
import Login from "@/views/Auth/Login.vue";
import Privacy from "@/views/Auth/Privacy.vue";
import { useAuthStore } from "@/stores/authStore";
const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        redirect: "/tabs/events",
    },
    {
        path: "/register",
        name: "register",
        component: () => import("@/views/Auth/Register.vue"),
    },
    {
        path: "/personalinfo",
        name: "personalinfo",
        component: () => import("@/views/Auth/PersonalInfo.vue"),
    },
    {
        path: "/security",
        name: 'security',
        component: () => import("@/views/Auth/Security.vue"),
    },
    {
        path: "/login",
        name: "login",
        component: () => import("@/views/Auth/Login.vue"),
    },
    {
        path: "/privacy",
        name: "privacy",
        component: () => import("@/views/Auth/Privacy.vue"),
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
                component: () => import("@/views/Events.vue"),
            },
            {
                path: "reservations",
                name: "reservations",
                component: () => import("@/views/Reservations.vue"),
                meta: { requiresAuth: true },
            },
            {
                path: "profile",
                name: "profile",
                component: () => import("@/views/Auth/Profile.vue"),
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

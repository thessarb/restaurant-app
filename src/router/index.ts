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
        component: () => Register,
        name: "register",
    },
    {
        path: "/personalinfo",
        component: () => PersonalInfo,
        name: "personalinfo",
    },
    {
        path: "/security",
        component: () => Security,
        name: 'security'
    },
    {
        path: "/login",
        component: () => Login,
        name: "login",
    },
    {
        path: "/privacy",
        component: () => Privacy,
        name: "privacy",
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
                component: () => import("@/views/Events.vue"),
                name: "events",
            },
            {
                path: "reservations",
                component: () => import("@/views/Reservations.vue"),
                name: "reservations",
                meta: { requiresAuth: true },
            },
            {
                path: "profile",
                component: () => import("@/views/Auth/Profile.vue"),
                name: "profile",
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

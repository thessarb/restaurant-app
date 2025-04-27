import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import TabsPage from "@/views/TabsPage.vue";
import { useAuthStore } from "@/stores/authStore";
import { Network } from '@capacitor/network';
import { App ,URLOpenListenerEvent} from '@capacitor/app';


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
                meta: { requiresAuth: true },
            },
            {
                path: "reservetype/:id/vip",
                name: "reservevip",
                component: () => import("@/views/events/Vip.vue"),
                meta: { requiresAuth: true }
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

router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();
    await authStore.initialize();

    const status = await internetStatus();
    if (!status.connected && to.path !== "/connection") {
        next("/connection");
    } else if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next({ path: "/login", query: { redirect: to.fullPath } });
    } else {
        next();
    }
});

App.addListener('appUrlOpen', async (event: URLOpenListenerEvent) => {
    const url = event.url;
    
    // Extract the eventId from the URL (assuming it's part of the path)
    const slug = url.split('usarestaurant.tech').pop();
    const eventIdMatch = slug?.match(/tabs\/reserve\/([^?]+)/); // Match event_id in the URL
    const sessionIdMatch = slug?.match(/session_id=([^&]+)/); // Match session_id in the URL
    
    if (eventIdMatch && sessionIdMatch) {
        const eventId = eventIdMatch[1];
        const sessionId = sessionIdMatch[1];

        // Now you have both eventId and sessionId
        // Push the route using Vue Router or your app's routing system
        router.push({
            name: 'reserve', 
            params: { id: eventId },
            query: { session_id: sessionId }
        });
    }
});

export default router;

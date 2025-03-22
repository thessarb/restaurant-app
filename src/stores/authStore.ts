import { defineStore } from 'pinia';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { Storage } from '@ionic/storage';

// Define types for state and actions
interface RegisterData {
    name: string;
    email: string;
    phone: string;
    password: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    role_id: number;
    email_verified_at: string;  // or Date if you'd prefer to store it as Date
    created_at: string;         // or Date
    updated_at: string;         // or Date
    image: string | null;
}

interface AuthState {
    isAuthenticated: boolean;
    endpoint: string;
    user: User | null;  // Define user type here instead of `any`
    token: string | null;
    router: ReturnType<typeof useRouter>;
    register: RegisterData | null;
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        isAuthenticated: false,
        endpoint: import.meta.env.VITE_APP_ENDPOINT as string,
        user: null,
        token: null,
        router: useRouter(),
        register: null,
    }),

    actions: {
        async initialize() {
            const store = new Storage();
            await store.create();
            const storedUser = await store.get('user');
            const storedToken = await store.get('token');

            if (storedUser && storedToken) {
                this.user = storedUser;
                this.token = storedToken;
                this.isAuthenticated = true;
            }
        },
        setAuthenticated(value: boolean) {
            this.isAuthenticated = value;
        },

        async login(data: { email: string; password: string }) {
            try {
                const response = await axios.post(`${this.endpoint}login`, data);
                if (response.data) {
                    await this.fetchUserData(response.data);
                    this.router.push({ name: 'profile' });
                }
            } catch (error) {
                console.error('Error during login:', error);
                this.isAuthenticated = false;
            }
        },

        async logout() {
            try {
                if (this.user && this.token) {
                    await axios.delete(`${this.endpoint}${this.user.id}`, {
                        headers: {
                            Accept: 'application/json',
                            Authorization: `Bearer ${this.token}`,
                        },
                    });
                    this.isAuthenticated = false;
                    this.user = null;
                    this.token = null;
                    this.deleteUserStore();
                    this.router.push({ name: 'login' });
                }
            } catch (error) {
                console.error('Logout failed:', error);
            }
        },

        async register() {
            if (this.register) {
                try {
                    await axios.post(this.endpoint, {
                        name: this.register.name,
                        email: this.register.email,
                        phone: this.register.phone,
                        password: this.register.password,
                    });
                    this.login({
                        email: this.register.email,
                        password: this.register.password,
                    });
                } catch (error) {
                    console.error('Registration failed:', error);
                }
            }
        },

        async fetchUserData(data: { user: User; token: string }) {
            this.user = data.user;
            this.isAuthenticated = true;
            this.token = data.token;
        
            const sanitizedUser = {
                ...this.user,
                email_verified_at: new Date(this.user.email_verified_at).toISOString(),
                created_at: new Date(this.user.created_at).toISOString(),
                updated_at: new Date(this.user.updated_at).toISOString(),
            };
        
            try {
                const store = new Storage();
                await store.create();
                await store.set('user', sanitizedUser);
                await this.storeUser(sanitizedUser);
                await store.set('token', this.token);

            } catch (error) {
                console.error('Error during login:', error);
            }
        },
        

        async storeUser(user: User | null) {
            if (!user) return;

            const store = new Storage();
            await store.create();

            const sanitizedUser = {
                ...user,
                email_verified_at: new Date(user.email_verified_at).toISOString(),
                created_at: new Date(user.created_at).toISOString(),
                updated_at: new Date(user.updated_at).toISOString(),
            };

            await store.set('user', sanitizedUser);
        },

        async deleteUserStore() {
            const store = new Storage();
            await store.create();
            await store.remove('user');
            await store.remove('token');
        },
    },
});

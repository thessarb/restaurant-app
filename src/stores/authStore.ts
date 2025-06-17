import { defineStore } from 'pinia';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { Storage } from '@ionic/storage';

interface RegisterData {
    name: any;
    surname: any;
    email: any;
    phone: any;
    gender: any;
    password: any;
    password_confirmation: any;
}

interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: UserRole | null;
    role_id: number;
    email_verified_at: string;
    created_at: string;
    updated_at: string;
    image: string | null;
}
interface UserRole {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;   
}
interface AuthState {
    isAuthenticated: boolean;
    endpoint: string;
    user: User | null;  // Define user type here instead of `any`
    token: string | null;
    router: ReturnType<typeof useRouter>;
    registerData: RegisterData | null;
    isNormalUser: boolean;
    loginErrors: { message?: string } | null;
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        isAuthenticated: false,
        endpoint: import.meta.env.VITE_APP_ENDPOINT as string,
        user: null,
        token: null,
        router: useRouter(),
        registerData: null,
        isNormalUser: false,
        loginErrors:{}
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
                    this.isNormalUser = response.data.user.role_id !== 3 || response.data.user.role_id !== undefined;
                    this.loginErrors = null
                }
            } catch (error: any) {
                console.error('Error during login:', error);
                this.loginErrors = {
                    message: error.response.data?.message,
                }
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
                    this.isNormalUser = true;
                    this.deleteUserStore();
                    this.router.push({ name: 'login' });
                }
            } catch (error: any) {
                this.isAuthenticated = false;
                this.user = null;
                this.token = null;
                this.isNormalUser = true;
                this.deleteUserStore();
                this.router.push({ name: 'login' });
                console.error('Logout failed:', error);
            }
        },

        async register() {
            if (this.registerData) {
                try {
                    await axios.post(this.endpoint+'register', {
                        name: this.registerData.name,
                        email: this.registerData.email,
                        phone: this.registerData.phone,
                        gender: this.registerData.gender,
                        password: this.registerData.password,
                        password_confirmation: this.registerData.password_confirmation,
                    });
                    this.login({
                        email: this.registerData.email,
                        password: this.registerData.password,
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
                await this.storeUser(sanitizedUser);
            } catch (error: any) {
                // console.error('Error during login:', error);
            }
        },
        

        async storeUser(user: User | null) {
            if (!user) return;
            const store = new Storage();
            await store.create();
            await store.set('token', this.token);
            const sanitizedUser = JSON.parse(JSON.stringify(user));
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

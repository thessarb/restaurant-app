import { defineStore } from 'pinia';
import axios from 'axios';
import { useRouter } from 'vue-router';

// Define types for state and actions
interface RegisterData {
    name: string;
    email: string;
    phone: string;
    password: string;
}

interface AuthState {
    isAuthenticated: boolean;
    endpoint: string;
    user: any;  // You can replace `any` with a more specific type for the user
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

        async fetchUserData(data: { user: any; token: string }) {
            this.user = data.user;
            this.isAuthenticated = true;
            this.token = data.token;
        },
    },
});

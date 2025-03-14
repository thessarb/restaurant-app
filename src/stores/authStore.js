import { defineStore } from 'pinia';
import axios from 'axios';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        isAuthenticated: false,
        endpoint: import.meta.env.VITE_APP_ENDPOINT,
        user: null,
        token : null,
        router: useRouter()

    }),

    actions: {
        setAuthenticated(value) {
            this.isAuthenticated = value;
        },
        async login(data) {
            try {
                const response = await axios.post(this.endpoint + 'login', data);
                if (response.data) {
                    await this.fetchUserData(response.data);
                    this.router.push({name: 'profile'})
                }
            } catch (error) {
                console.error('Error during login:', error);
                this.isAuthenticated = false;
            }
        },

        async logout() {
            try {
                const response = await axios.delete(this.endpoint + this.user.id, {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${this.token}`
                    }
                });
                this.isAuthenticated = false;
                this.user = null;
                this.token = null;
                this.router.push({name: 'login'})
                console.log('Logged out successfully', response);
            } catch (error) {
                console.error('Logout failed:', error);
            }
        },

        async fetchUserData(data) {
            this.user = data.user
            this.isAuthenticated = true
            this.token = data.token
        },
    },
});
import { defineStore } from 'pinia';
import { Storage } from '@ionic/storage';

const storage = new Storage();
storage.create(); // Create storage once globally

interface DataState {
    table1: string;
    table2: string;
}

export const useDataStore = defineStore('data', {
    state: (): DataState => ({
        table1: '',
        table2: '',
    }),

    actions: {
        async storeTable1() {
            const existing = await storage.get('table1');
            if (!existing) {
                const response = await fetch('/zone-1.svg');
                const svgText = await response.text();
                this.table1 = svgText;
                await storage.set('table1', svgText);
            } else {
                this.table1 = existing;
            }
        },

        async storeTable2() {
            const existing = await storage.get('table2');
            if (!existing) {
                const response = await fetch('/zone-2.svg');
                const svgText = await response.text();
                this.table2 = svgText;
                await storage.set('table2', svgText);
            } else {
                this.table2 = existing;
            }
        }
    },
});

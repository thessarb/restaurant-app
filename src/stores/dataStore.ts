import { defineStore } from 'pinia';
import { Storage } from '@ionic/storage';
import zone1Svg from '/zone-1.svg?raw';
import zone2Svg from '/zone-2.svg?raw';

const storage = new Storage();
storage.create();

export const useDataStore = defineStore('data', {
    actions: {
        async storeTable1() {
            const existing = await storage.get('table1_chunkCount');
            if (!existing) {
                await storage.set('table1', zone1Svg);
            }
            return;
        },

        async storeTable2() {
            const existing = await storage.get('table2_chunkCount');
            if (!existing) {
                await storage.set('table2', zone2Svg);
            }
            return;
        }
    },
});

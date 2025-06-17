import { defineStore } from 'pinia';
import { Storage } from '@ionic/storage';
import zone1Svg from '/zone-1.svg?raw';
import zone2Svg from '/zone-2.svg?raw';

const storage = new Storage();
storage.create(); // Create storage once globally

const CHUNK_SIZE = 1024 * 1024; // 1MB

const splitIntoChunks = (data: string, chunkSize: number): string[] => {
    const chunks = [];
    for (let i = 0; i < data.length; i += chunkSize) {
        chunks.push(data.slice(i, i + chunkSize));
    }
    return chunks;
}

const saveChunks = async (baseKey: string, data: string) => {
    const chunks = splitIntoChunks(data, CHUNK_SIZE);
    await storage.set(`${baseKey}_chunkCount`, chunks.length);
    for (let i = 0; i < chunks.length; i++) {
        await storage.set(`${baseKey}_chunk_${i}`, chunks[i]);
    }
}

const loadChunks = async (baseKey: string): Promise<string> => {
    const chunkCount = await storage.get(`${baseKey}_chunkCount`);
    if (!chunkCount || typeof chunkCount !== 'number') return '';

    const chunks = [];
    for (let i = 0; i < chunkCount; i++) {
        const part = await storage.get(`${baseKey}_chunk_${i}`);
        if (typeof part === 'string') {
            chunks.push(part);
        } else {
            return '';
        }
    }

    return chunks.join('');
}

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
            const existing = await storage.get('table1_chunkCount');
            if (!existing) {
                this.table1 = zone1Svg;
                await saveChunks('table1', zone1Svg);
            } else {
                this.table1 = existing;
            }
            return;
        },

        async storeTable2() {
            const existing = await storage.get('table2_chunkCount');
            if (!existing) {
                this.table2 = zone2Svg;
                await saveChunks('table2', zone2Svg);
            } else {
                this.table2 = existing;
            }
            return;
        }
    },
});

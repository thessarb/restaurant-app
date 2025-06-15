import { defineStore } from 'pinia';
import { Storage } from '@ionic/storage';

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

const loadChunks = async (baseKey: string): Promise<string | null> => {
    const chunkCount = await storage.get(`${baseKey}_chunkCount`);
    if (!chunkCount || typeof chunkCount !== 'number') return null;

    const chunks = [];
    for (let i = 0; i < chunkCount; i++) {
        const part = await storage.get(`${baseKey}_chunk_${i}`);
        if (typeof part === 'string') {
            chunks.push(part);
        } else {
            return null;
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
            const existing = await loadChunks('table1');
            if (!existing) {
                const response = await fetch('/zone-1.svg');
                const svgText = await response.text();
                this.table1 = svgText;
                await saveChunks('table1', svgText);
            } else {
                this.table1 = existing;
            }
        },

        async storeTable2() {
            const existing = await loadChunks('table2');
            if (!existing) {
                const response = await fetch('/zone-2.svg');
                const svgText = await response.text();
                this.table2 = svgText;
                await saveChunks('table2', svgText);
            } else {
                this.table2 = existing;
            }
        }
    },
});

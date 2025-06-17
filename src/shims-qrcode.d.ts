declare module 'qrcode' {
    export function toDataURL(
        text: string,
        options?: {
            width?: number;
            margin?: number;
            color?: {
                dark?: string;
                light?: string;
            };
        }
    ): Promise<string>;

    export function toCanvas(
        canvas: HTMLCanvasElement,
        text: string,
        options?: {
            width?: number;
            margin?: number;
            color?: {
                dark?: string;
                light?: string;
            };
        }
    ): Promise<void>;

    export function toString(
        text: string | { toString(): string },
        options?: {
            type?: 'svg' | 'terminal';
            width?: number;
            margin?: number;
            color?: {
                dark?: string;
                light?: string;
            };
        }
    ): Promise<string>;
}
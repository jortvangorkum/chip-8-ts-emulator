import { DISPLAY_HEIGHT, DISPLAY_WIDTH, KEY_MAP, COLOR } from "./constants.js";
import CpuInterface from "./cpu_interface.js";

export default class WebCpuInterface extends CpuInterface {
    frameBuffer: number[][];
    screen: HTMLCanvasElement;
    multiplierPixels: number;
    context: CanvasRenderingContext2D;
    keys: number;
    keyPressed: number;
    
    constructor() {
        super();

        this.screen = <HTMLCanvasElement> document.getElementById('canvas');

        this.multiplierPixels = 10;
        this.screen.width = DISPLAY_WIDTH * this.multiplierPixels;
        this.screen.height = DISPLAY_HEIGHT * this.multiplierPixels;

        this.context = this.screen.getContext('2d');
        this.clearDisplay();

        this.keys = 0;
        this.keyPressed = null;
        this.setupKeysInput();
    }

    private createFrameBuffer(): number[][] {
        const frameBuffer = [];

        for (let j = 0; j < DISPLAY_HEIGHT; j++) {
            frameBuffer.push([]);
            for (let i = 0; i < DISPLAY_WIDTH; i++) {
                frameBuffer[j].push(0);
            }
        }

        return frameBuffer;
    }

    private setupKeysInput(): void {
        document.addEventListener('keydown', (event) => {
            const keyIndex = KEY_MAP.indexOf(event.key);

            if (keyIndex > -1) {
                this.setKeys(keyIndex);
            }
        })

        document.addEventListener('keyup', (event) => {
            this.resetKeys();
        })
    }

    private setKeys(keyIndex: number): void {
        let keyMask = 1 << keyIndex;

        this.keys |= keyMask;
        this.keyPressed = keyIndex;
    }

    private resetKeys(): void {
        this.keys = 0;
        this.keyPressed = null;
    }

    waitKey(): number {
        const keyPressed = this.keyPressed;
        this.keyPressed = null;

        return keyPressed;
    }
    
    getKeys(): number {
        return this.keys;
    }

    clearDisplay(): void {
        this.frameBuffer = this.createFrameBuffer();
        this.context.fillStyle = 'black';
        this.context.fillRect(0, 0, this.screen.width, this.screen.height);
    }

    drawPixel(value: number, x: number, y: number): number {
        this.frameBuffer[y][x] ^= value;

        if (this.frameBuffer[y][x]) {
            this.context.fillStyle = COLOR;
            this.context.fillRect(
                x * this.multiplierPixels,
                y * this.multiplierPixels,
                this.multiplierPixels,
                this.multiplierPixels,
            );
        } else {
            this.context.fillStyle = 'black';
            this.context.fillRect(
                x * this.multiplierPixels,
                y * this.multiplierPixels,
                this.multiplierPixels,
                this.multiplierPixels,
            );
        }

        return this.frameBuffer[y][x] & value;
    }
}
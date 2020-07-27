export default abstract class CpuInterface {

    abstract clearDisplay(): void;
    abstract waitKey(): number;
    abstract getKeys(): number;
    abstract drawPixel(value: number, x: number, y: number): number;
}
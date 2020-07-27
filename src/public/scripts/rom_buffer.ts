export class RomBuffer {
    /** 16-bit big endian opcodes from the buffer */
    data: number[];

    constructor(buffer: Uint8Array) {
        this.data = []

        for (let i = 0; i < buffer.length; i += 2) {
            this.data.push((buffer[i] << 8) | (buffer[i+1] << 0));
        }
    }
}
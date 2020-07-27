import { dissamble, InstructionDecoded } from "./instruction_set.js";
import { DISPLAY_WIDTH, DISPLAY_HEIGHT, FONT_SPRITES } from "./constants.js";
import CpuInterface from "./cpu_interface.js";
import { RomBuffer } from "./rom_buffer.js";

export default class CPU {
    /** 
     * Memory
     * 
     * Array of 4096 elements which contains 8 bits 
     * Also known as 4KB
     */
    memory: Uint8Array;
    /**
     * Program counter
     * 
     * The program counter is a 16-bit (65,536) integer.
     * The memory location from 0x000 to 0x1FF is reserved
     * So the memory starts at 0x200 (512)
     */
    PC: number;
    /**
     * Registers
     * 
     * 16 general purpose 8-bit registers, usually referred to as Vx, where x is a hexadecimal digit.
     */
    registers: Uint8Array;
    /**
     * Index register
     * 
     * Is a 16-bit register called "I".
     * This register is used to store memory addresses,
     * so only the lowest 12 bits are usually used.
     */
    I: number;
    /**
     * Stack pointer
     * 
     * The stack pointer is 8-bit.
     * Is used to point to the topmost level of the stack.
     * -1 is used when there is no where to point.
     */
    SP: number;
    /**
     * Stack
     * 
     * The stack is an array of 16 16-bit values.
     */
    stack: Uint16Array;
    /** 
     * Delay Timer
     * 
     * The delay timer is active whenever the delay timer register (DT) is non-zero.
     * This timer does nothing more than subtract 1 from the value of DT at a rate of 60Hz. When DT reaches 0, it deactivates.
     */
    DT: number;
    /**
     * Sound Timer
     * 
     * The sound timer is active whenever the sound timer register (ST) is non-zero.
     * This timer also decrements at a rate of 60Hz, however as long as ST's value is greater than zero, the Chip-8 buzzer will sound. 
     * The sound produced by the Chip-8 interpreter has only one tone. The frequency of this tone is decided by the author of the interpreter.
     */
    ST: number;
    /**
     * CPU Interface
     * 
     * To execute fucntions from tools outside the Chip-8
     */
    cpuInterface: CpuInterface;


    constructor(cpuInteface: CpuInterface) {
        this.cpuInterface = cpuInteface;
        this.setIntialValues();
    }

    setIntialValues(): void {
        this.memory = new Uint8Array(4096);
        this.PC = 0x200;
        this.registers = new Uint8Array(16);
        this.I = 0;
        this.SP = -1;
        this.stack = new Uint16Array(16);
        this.DT = 0;
        this.ST = 0;
    }

    load(romBuffer: RomBuffer): void {
        this.setIntialValues();

        for (let i = 0; i < FONT_SPRITES.length; i++) {
            this.memory[i] = FONT_SPRITES[i];
        }

        const memoryStart = 0x200;

        for (let i = 0; i < romBuffer.data.length; i++) {
            this.memory[memoryStart + 2 * i] = romBuffer.data[i] >> 8;
            this.memory[memoryStart + 2 * i + 1] = romBuffer.data[i] & 0x00FF;
        }
    }

    step(): void {
        const opcode = this.fetch();
        console.log(opcode.toString(16));
        const instruction = this.decode(opcode);
        this.execute(instruction);
    }

    tick(): void {
        if (this.DT > 0) {
            this.DT--;
        }

        if (this.ST > 0) {
            this.ST--;
        }
    }

    private fetch(): number {
        return ((this.memory[this.PC] << 8) | (this.memory[this.PC + 1] << 0));
    }

    private decode(opcode: number): InstructionDecoded {
        return dissamble(opcode);
    }

    private nextInstruction() {
        this.PC += 2;
    }

    private skipInstruction() {
        this.nextInstruction();
        this.nextInstruction();
    }

    private execute(instruction: InstructionDecoded) {
        const [id, args] = instruction;

        console.log(id, args.map(x => x.toString(16)));

        switch(id) {
            case 'CLS':
                // Clear screen
                this.cpuInterface.clearDisplay();
                this.nextInstruction();
                break;
            case 'RET':
                this.PC = this.stack[this.SP];
                this.SP--;
                break;
            case 'JP_ADDR':
                this.PC = args[0];
                break;
            case 'CALL_ADDR':
                this.SP++;
                // Puts the next instruction on the top of the stack
                this.stack[this.SP] = this.PC + 2;
                this.PC = args[0];
                break;
            case 'SE_VX_KK':
                if (this.registers[args[0]] === args[1]) { this.skipInstruction(); }
                else { this.nextInstruction(); }
                break;
            case 'SNE_VX_KK':
                if (this.registers[args[0]] !== args[1]) { this.skipInstruction(); }
                else { this.nextInstruction(); }
                break;
            case 'SE_VX_VY':
                if (this.registers[args[0]] === this.registers[args[1]]) { this.skipInstruction(); }
                else { this.nextInstruction(); }
                break;
            case 'LD_VX_KK':
                this.registers[args[0]] = args[1];
                this.nextInstruction();
                break;
            case 'ADD_VX_KK':
                this.registers[args[0]] += this._clamp(args[1], 8);
                this.nextInstruction();
                break;
            case 'LD_VX_VY':
                this.registers[args[0]] = this.registers[args[1]];
                this.nextInstruction();
                break;
            case 'OR_VX_VY':
                this.registers[args[0]] |= this.registers[args[1]];
                this.nextInstruction();
                break;
            case 'AND_VX_VY':
                this.registers[args[0]] &= this.registers[args[1]];
                this.nextInstruction();
                break;
            case 'XOR_VX_VY':
                this.registers[args[0]] ^= this.registers[args[1]];
                this.nextInstruction();
                break;
            case 'ADD_VX_VY':
                const addSum = this._clamp(this.registers[args[0]] + this.registers[args[1]], 8);
                this.registers[args[0]] = addSum;
                this.registers[0xF] = addSum > 0xFF ? 1 : 0;
                this.nextInstruction();
                break;
            case 'SUB_VX_VY':
                this.registers[args[0xF]] = this.registers[args[0]] > this.registers[args[1]] ? 1 : 0;
                this.registers[args[0]] -= this.registers[args[1]];
                this.nextInstruction();
                break;
            case 'SHR_VX':
                this.registers[args[0xF]] = this.registers[args[0]] & 1;
                this.registers[args[0]] >>= 1;
                this.nextInstruction();
                break;
            case 'SUBN_VX_VY':
                this.registers[args[0xF]] = this.registers[args[1]] > this.registers[args[0]] ? 1 : 0;
                this.registers[args[0]] = this.registers[args[1]] - this.registers[args[0]];
                this.nextInstruction();
                break;
            case 'SHL_VX':
                this.registers[args[0xF]] = this.registers[args[0]] >> 7;
                this.registers[args[0]] <<= 1;
                this.nextInstruction();
                break;
            case 'SNE_VX_VY':
                if (this.registers[args[0]] !== this.registers[args[1]]) { this.skipInstruction(); }
                else { this.nextInstruction(); }
                break;
            case 'LD_I_ADDR':
                this.I = args[0];
                this.nextInstruction();
                break;
            case 'JP_V0_ADDR':
                this.PC = args[0] + this.registers[0];
                break;
            case 'RND_VX_KK':
                this.registers[args[0]] = Math.floor(Math.random() * 0xFF) & args[1];
                this.nextInstruction();
                break;
            case 'DRW_VX_VY_N':
                this.registers[0xF] = 0;
                for (let i = 0; i < args[2]; i++) {
                    const line = this.memory[this.I + i];
                    for (let position = 0; position < 8; position++) {
                        const value = line & (1 << (7 - position)) ? 1 : 0;
                        const x = (this.registers[args[0]] + position) % DISPLAY_WIDTH;
                        const y = (this.registers[args[1]] + i) % DISPLAY_HEIGHT;

                        if (this.cpuInterface.drawPixel(value, x, y)) {
                            this.registers[0xF] = 1;
                        }
                    }
                }
                this.nextInstruction();
                break;
            case 'SKP_VX':
                if (this.cpuInterface.getKeys() & (1 << this.registers[args[0]])) { this.skipInstruction(); }
                else { this.nextInstruction(); }
                break;
            case 'SKNP_VX':
                if (!(this.cpuInterface.getKeys() & (1 << this.registers[args[0]]))) { this.skipInstruction(); }
                else { this.nextInstruction(); }
                break;
            case 'LD_VX_DT':
                this.registers[args[0]] = this.DT;
                this.nextInstruction();
                break;
            case 'LD_VX_K':
                const keyPress =  this.cpuInterface.waitKey();
                if (!keyPress) { return; }
                this.registers[args[0]] = keyPress;
                this.nextInstruction();
                break;
            case 'LD_DT_VX':
                this.DT = this.registers[args[0]];
                this.nextInstruction();
                break;
            case 'LD_ST_VX':
                this.ST = this.registers[args[0]];
                this.nextInstruction();
                break;
            case 'ADD_I_VX':
                this.I += this.registers[args[0]];
                this.nextInstruction();
                break;
            case 'LD_F_VX':
                // The input is times 5 because the sprites take 5 bytes.
                this.I = this.registers[args[0]] * 5;
                this.nextInstruction();
                break;
            case 'LD_B_VX':
                let x = this.registers[args[0]];
                const a = Math.floor(x / 100);
                x -= a * 100;
                const b = Math.floor(x / 10);
                x -= b * 10;
                const c = Math.floor(x);

                this.memory[this.I] = a;
                this.memory[this.I + 1] = b;
                this.memory[this.I + 2] = c;
                this.nextInstruction();
                break;
            case 'LD_I_VX':
                for (let i = 0; i < args[0]; i++) {
                    this.memory[this.I + i] = this.registers[i];
                }
                this.nextInstruction();
                break;
            case 'LD_VX_I':
                for (let i = 0; i < args[0]; i++) {
                    this.registers[i] = this.memory[this.I + i];
                }
                this.nextInstruction();
                break;
            default:
                throw new Error('No execution found for instruction id: ' + id);
        }
    }

    /** Clamps value given the max bit size */
    _clamp(value: number, bitSize: number) {
        const size = 2 ** bitSize;
        if (value > size) {
            return value - size;
        }
        return value;
    }
}
/**
 * Chip-8 Instructions
 * 
 * The original implementation of the Chip-8 language includes 36 different instructions.
 */

interface Instruction {
    key: number,
    id: string,
    name: string,
    mask: number,
    pattern: number,
    arguments: InstructionArgument[]
}

interface InstructionArgument {
    mask: number,
    shift: number,
    /** Types: R = Register, A = Address */
    type: "R" | "A" | "KK" | "N"
}

export const INSTRUCTION_SET: Instruction[] = [
    {
        key: 2,
        id: 'CLS',
        name: 'CLS',
        mask: 0xFFFF,
        pattern: 0x00E0,
        arguments: []
    },
    {
        key: 3,
        id: 'RET',
        name: 'RET',
        mask: 0xFFFF,
        pattern: 0x00EE,
        arguments: []
    },
    {
        key: 4,
        id: 'JP_ADDR',
        name: 'JP',
        mask: 0xF000,
        pattern: 0x1000,
        arguments: [
            { mask: 0x0FFF, shift: 0, type: 'A' }
        ]
    },
    {
        key: 5,
        id: 'CALL_ADDR',
        name: 'CALL',
        mask: 0xF000,
        pattern: 0x2000,
        arguments: [
            { mask: 0x0FFF, shift: 0, type: 'A' }
        ]
    },
    {
        key: 6,
        id: 'SE_VX_KK',
        name: 'SE',
        mask: 0xF000,
        pattern: 0x3000,
        arguments: [
            { mask: 0x0F00, shift: 8, type: 'R' },
            { mask: 0x00FF, shift: 0, type: 'KK' },
        ]
    },
    {
        key: 7,
        id: 'SNE_VX_KK',
        name: 'SNE',
        mask: 0xF000,
        pattern: 0x4000,
        arguments: [
            { mask: 0x0F00, shift: 8, type: 'R' },
            { mask: 0x00FF, shift: 0, type: 'KK' },
        ]
    },
    {
        key: 8,
        id: 'SE_VX_VY',
        name: 'SE',
        mask: 0xF00F,
        pattern: 0x5000,
        arguments: [
            { mask: 0x0F00, shift: 8, type: 'R' },
            { mask: 0x00F0, shift: 4, type: 'R' },
        ]
    },
    {
        key: 9,
        id: 'LD_VX_KK',
        name: 'LD',
        mask: 0xF000,
        pattern: 0x6000,
        arguments: [
            { mask: 0x0F00, shift: 8, type: 'R' },
            { mask: 0x00FF, shift: 0, type: 'KK' },
        ]
    },
    {
        key: 10,
        id: 'ADD_VX_KK',
        name: 'ADD',
        mask: 0xF000,
        pattern: 0x7000,
        arguments: [
            { mask: 0x0F00, shift: 8, type: 'R' },
            { mask: 0x00FF, shift: 0, type: 'KK' },
        ]
    },
    {
        key: 11,
        id: 'LD_VX_VY',
        name: 'LD',
        mask: 0xF00F,
        pattern: 0x8000,
        arguments: [
            { mask: 0x0F00, shift: 8, type: 'R' },
            { mask: 0x00F0, shift: 4, type: 'R' },
        ]
    },
    {
        key: 12,
        id: 'OR_VX_VY',
        name: 'OR',
        mask: 0xF00F,
        pattern: 0x8001,
        arguments: [
            { mask: 0x0F00, shift: 8, type: 'R' },
            { mask: 0x00F0, shift: 4, type: 'R' },
        ]
    },
    {
        key: 13,
        id: 'AND_VX_VY',
        name: 'AND',
        mask: 0xF00F,
        pattern: 0x8002,
        arguments: [
            { mask: 0x0F00, shift: 8, type: 'R' },
            { mask: 0x00F0, shift: 4, type: 'R' },
        ]
    },
    {
        key: 14,
        id: 'XOR_VX_VY',
        name: 'XOR',
        mask: 0xF00F,
        pattern: 0x8003,
        arguments: [
            { mask: 0x0F00, shift: 8, type: 'R' },
            { mask: 0x00F0, shift: 4, type: 'R' },
        ]
    },
    {
        key: 15,
        id: 'ADD_VX_VY',
        name: 'ADD',
        mask: 0xF00F,
        pattern: 0x8004,
        arguments: [
            { mask: 0x0F00, shift: 8, type: 'R' },
            { mask: 0x00F0, shift: 4, type: 'R' },
        ]
    },
    {
        key: 16,
        id: 'SUB_VX_VY',
        name: 'SUB',
        mask: 0xF00F,
        pattern: 0x8005,
        arguments: [
            { mask: 0x0F00, shift: 8, type: 'R' },
            { mask: 0x00F0, shift: 4, type: 'R' },
        ]
    },
    {
        key: 17,
        id: 'SHR_VX',
        name: 'SUB',
        mask: 0xF00F,
        pattern: 0x8006,
        arguments: [
            { mask: 0x0F00, shift: 8, type: 'R' },
        ]
    },
    {
        key: 18,
        id: 'SUBN_VX_VY',
        name: 'SUBN',
        mask: 0xF00F,
        pattern: 0x8007,
        arguments: [
            { mask: 0x0F00, shift: 8, type: 'R' },
            { mask: 0x00F0, shift: 4, type: 'R' },
        ]
    },
    {
        key: 19,
        id: 'SHL_VX',
        name: 'SHL',
        mask: 0xF00F,
        pattern: 0x800E,
        arguments: [
            { mask: 0x0F00, shift: 8, type: 'R' },
        ]
    },
    {
        key: 20,
        id: 'SNE_VX_VY',
        name: 'SNE',
        mask: 0xF00F,
        pattern: 0x9000,
        arguments: [
            { mask: 0x0F00, shift: 8, type: 'R' },
            { mask: 0x00F0, shift: 4, type: 'R' },
        ]
    },
    {
        key: 21,
        id: 'LD_I_ADDR',
        name: 'LD',
        mask: 0xF000,
        pattern: 0xA000,
        arguments: [
            { mask: 0x0FFF, shift: 0, type: 'A' },
        ]
    },
    {
        key: 22,
        id: 'JP_V0_ADDR',
        name: 'JP',
        mask: 0xF000,
        pattern: 0xB000,
        arguments: [
            { mask: 0x0FFF, shift: 0, type: 'A' },
        ]
    },
    {
        key: 23,
        id: 'RND_VX_KK',
        name: 'RND',
        mask: 0xF000,
        pattern: 0xC000,
        arguments: [
            { mask: 0x0F00, shift: 8, type: 'R' },
            { mask: 0x00FF, shift: 0, type: 'KK' },
        ]
    },
    {
        key: 24,
        id: 'DRW_VX_VY_N',
        name: 'RND',
        mask: 0xF000,
        pattern: 0xD000,
        arguments: [
            { mask: 0x0F00, shift: 8, type: 'R' },
            { mask: 0x00F0, shift: 4, type: 'R' },
            { mask: 0x000F, shift: 0, type: 'N' },
        ]
    },
    {
        key: 25,
        id: 'SKP_VX',
        name: 'SKP',
        mask: 0xF0FF,
        pattern: 0xE09E,
        arguments: [
            { mask: 0x0F00, shift: 8, type: 'R' },
        ]
    },
    {
        key: 26,
        id: 'SKNP_VX',
        name: 'SKP',
        mask: 0xF0FF,
        pattern: 0xE0A1,
        arguments: [
            { mask: 0x0F00, shift: 8, type: 'R' },
        ]
    },
    {
        key: 27,
        id: 'LD_VX_DT',
        name: 'LD',
        mask: 0xF0FF,
        pattern: 0xF007,
        arguments: [
            { mask: 0x0F00, shift: 8, type: 'R' },
        ]
    },
    {
        key: 28,
        id: 'LD_VX_K',
        name: 'LD',
        mask: 0xF0FF,
        pattern: 0xF00A,
        arguments: [
            { mask: 0x0F00, shift: 8, type: 'R' },
        ]
    },
    {
        key: 29,
        id: 'LD_DT_VX',
        name: 'LD',
        mask: 0xF0FF,
        pattern: 0xF015,
        arguments: [
            { mask: 0x0F00, shift: 8, type: 'R' },
        ]
    },
    {
        key: 30,
        id: 'LD_ST_VX',
        name: 'LD',
        mask: 0xF0FF,
        pattern: 0xF018,
        arguments: [
            { mask: 0x0F00, shift: 8, type: 'R' },
        ]
    },
    {
        key: 31,
        id: 'ADD_I_VX',
        name: 'ADD',
        mask: 0xF0FF,
        pattern: 0xF01E,
        arguments: [
            { mask: 0x0F00, shift: 8, type: 'R' },
        ]
    },
    {
        key: 32,
        id: 'LD_F_VX',
        name: 'LD',
        mask: 0xF0FF,
        pattern: 0xF029,
        arguments: [
            { mask: 0x0F00, shift: 8, type: 'R' },
        ]
    },
    {
        key: 33,
        id: 'LD_B_VX',
        name: 'LD',
        mask: 0xF0FF,
        pattern: 0xF033,
        arguments: [
            { mask: 0x0F00, shift: 8, type: 'R' },
        ]
    },
    {
        key: 34,
        id: 'LD_I_VX',
        name: 'LD',
        mask: 0xF0FF,
        pattern: 0xF055,
        arguments: [
            { mask: 0x0F00, shift: 8, type: 'R' },
        ]
    },
    {
        key: 35,
        id: 'LD_VX_I',
        name: 'LD',
        mask: 0xF0FF,
        pattern: 0xF065,
        arguments: [
            { mask: 0x0F00, shift: 8, type: 'R' },
        ]
    },
]

export type InstructionDecoded = [string, number[]];

export function dissamble(opcode: number): InstructionDecoded {
    const instruction = INSTRUCTION_SET.find(
        instruction => (opcode & instruction.mask) === instruction.pattern
    )

    if (!instruction) { throw new Error('Instruction not found with opcode: ' + opcode.toString(16)); }

    const args = instruction.arguments.map(
        arg => (opcode & arg.mask) >> arg.shift
    )

    return [instruction.id, args];
}
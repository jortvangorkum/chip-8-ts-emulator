import CPU from "./cpu.js";
import WebCpuInterface from "./web_cpu_interface.js";
import { RomBuffer } from "./rom_buffer.js";

let timer = 0;
const webCpuInterace = new WebCpuInterface();
const cpu = new CPU(webCpuInterace);

function cycle() {
    timer++;

    if (timer % 5 === 0) {
        cpu.tick();
        timer = 0;
    }

    cpu.step();
}

async function loadRom() {
    const response = await fetch('./roms/PONG');
    const arrayBuffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const romBuffer = new RomBuffer(uint8Array);
    console.log(romBuffer.data.map(x => x.toString(16)));

    cpu.cpuInterface.clearDisplay();
    cpu.load(romBuffer);
}

window.onload = async function(event) {
    await loadRom();
    setInterval(cycle, 3);
}

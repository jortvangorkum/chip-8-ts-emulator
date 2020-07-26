import CPU from "./scripts/cpu";
import WebCpuInterface from "./scripts/web_cpu_interface";

let timer = 0;
const webCpuInterace = new WebCpuInterface();
const cpu = new CPU(webCpuInterace);


function cycle() {
    timer++;

    if (timer % 5 === 0) {
        cpu
        timer = 0;
    }
}

async function loadRom() {
    const response = await fetch('./roms/PONG');
    const arrayBuffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const romBuffer = new RomBuffer(uint8Array);

    cpu.cpuInterface.clearDisplay();
    cpu.load(romBuffer);
}

window.onload = function(event) {
    loadRom();
}

setInterval(cycle, 3);
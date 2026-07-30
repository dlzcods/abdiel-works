import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

let WIDTH = 960;
let HEIGHT = 180;
const FPS = 12;
const FRAMES = 96;

const FONT = {
  " ": [0,0,0,0,0,0,0], "A": [14,17,17,31,17,17,17], "B": [30,17,17,30,17,17,30],
  "C": [14,17,16,16,16,17,14], "D": [30,17,17,17,17,17,30], "E": [31,16,16,30,16,16,31],
  "F": [31,16,16,30,16,16,16], "G": [14,17,16,23,17,17,15], "H": [17,17,17,31,17,17,17],
  "I": [31,4,4,4,4,4,31], "J": [7,2,2,2,18,18,12], "K": [17,18,20,24,20,18,17],
  "L": [16,16,16,16,16,16,31], "M": [17,27,21,21,17,17,17], "N": [17,25,21,19,17,17,17],
  "O": [14,17,17,17,17,17,14], "P": [30,17,17,30,16,16,16], "Q": [14,17,17,17,21,18,13],
  "R": [30,17,17,30,20,18,17], "S": [15,16,16,14,1,1,30], "T": [31,4,4,4,4,4,4],
  "U": [17,17,17,17,17,17,14], "V": [17,17,17,17,17,10,4], "W": [17,17,17,21,21,21,10],
  "X": [17,17,10,4,10,17,17], "Y": [17,17,10,4,4,4,4], "Z": [31,1,2,4,8,16,31],
  "0": [14,17,19,21,25,17,14], "1": [4,12,4,4,4,4,14], "2": [14,17,1,2,4,8,31],
  "3": [30,1,1,14,1,1,30], "4": [2,6,10,18,31,2,2], "5": [31,16,16,30,1,1,30],
  "6": [14,16,16,30,17,17,14], "7": [31,1,2,4,8,8,8], "8": [14,17,17,14,17,17,14],
  "9": [14,17,17,15,1,1,14], ".": [0,0,0,0,0,12,12], ":": [0,12,12,0,12,12,0],
  "/": [1,2,2,4,8,8,16], "-": [0,0,0,31,0,0,0], ">": [16,8,4,2,4,8,16],
};

const themes = {
  light: [
    [255,255,255], [31,35,40], [89,99,110], [208,215,222], [246,248,250],
    [207,34,46], [255,235,238], [26,127,55], [218,251,225], [110,118,129],
    [188,195,203], [235,238,240], [255,255,255], [255,255,255], [255,255,255], [255,255,255],
  ],
  dark: [
    [13,17,23], [240,246,252], [139,148,158], [48,54,61], [22,27,34],
    [248,81,73], [50,24,28], [63,185,80], [18,46,25], [110,118,129],
    [72,79,88], [30,36,44], [13,17,23], [13,17,23], [13,17,23], [13,17,23],
  ],
};

const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const mix = (a, b, t) => a + (b - a) * t;
const ease = (t) => { t = clamp(t); return t * t * (3 - 2 * t); };
const between = (t, a, b) => ease((t - a) / (b - a));

function canvas(fill = 0) {
  const pixels = new Uint8Array(WIDTH * HEIGHT);
  pixels.fill(fill);
  return pixels;
}

function set(p, x, y, c) {
  x = Math.round(x); y = Math.round(y);
  if (x >= 0 && x < WIDTH && y >= 0 && y < HEIGHT) p[y * WIDTH + x] = c;
}

function rect(p, x, y, w, h, c) {
  const x0 = Math.max(0, Math.round(x)); const y0 = Math.max(0, Math.round(y));
  const x1 = Math.min(WIDTH, Math.round(x + w)); const y1 = Math.min(HEIGHT, Math.round(y + h));
  for (let yy = y0; yy < y1; yy++) p.fill(c, yy * WIDTH + x0, yy * WIDTH + x1);
}

function line(p, x0, y0, x1, y1, c, width = 1) {
  const dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
  const dy = -Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;
  while (true) {
    rect(p, x0 - Math.floor(width / 2), y0 - Math.floor(width / 2), width, width, c);
    if (Math.round(x0) === Math.round(x1) && Math.round(y0) === Math.round(y1)) break;
    const e2 = 2 * err;
    if (e2 >= dy) { err += dy; x0 += sx; }
    if (e2 <= dx) { err += dx; y0 += sy; }
  }
}

function circle(p, cx, cy, r, c, fill = true) {
  for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) {
    const d = x * x + y * y;
    if ((fill && d <= r * r) || (!fill && d <= r * r && d >= (r - 1.5) * (r - 1.5))) set(p, cx + x, cy + y, c);
  }
}

function text(p, value, x, y, c, scale = 2, tracking = 2) {
  value = value.toUpperCase();
  for (const ch of value) {
    const glyph = FONT[ch] || FONT[" "];
    for (let row = 0; row < 7; row++) for (let col = 0; col < 5; col++) {
      if (glyph[row] & (1 << (4 - col))) rect(p, x + col * scale, y + row * scale, scale, scale, c);
    }
    x += 5 * scale + tracking;
  }
}

function arrow(p, x, y, c) {
  line(p, x - 5, y - 4, x, y, c); line(p, x - 5, y + 4, x, y, c);
}

function token(p, x, y, index, state) {
  const color = state === "reject" ? 5 : state === "pass" ? 7 : 1;
  const dim = state === "pending" ? 2 : color;
  circle(p, x, y, 6, color, false);
  circle(p, x, y, 2, color, true);
  line(p, x + 9, y, x + 25, y, dim);
  text(p, `0${index + 1}`, x + 30, y - 5, dim, 1, 1);
  if (state === "owned") {
    circle(p, x + 52, y, 4, 1, false);
    line(p, x + 50, y + 3, x + 54, y - 3, 1);
  }
  if (state === "pass") {
    line(p, x + 50, y, x + 53, y + 3, 7, 2);
    line(p, x + 53, y + 3, x + 59, y - 4, 7, 2);
  }
  if (state === "reject") {
    line(p, x + 50, y - 4, x + 58, y + 4, 5, 2);
    line(p, x + 58, y - 4, x + 50, y + 4, 5, 2);
  }
}

function drawFrame(frame) {
  const p = canvas();
  const t = frame / FRAMES;
  const stations = [96, 340, 596, 842];

  text(p, "AI DRAFT", 66, 18, 2, 2, 2);
  text(p, "ENGINEER REVIEW", 267, 18, 2, 2, 2);
  text(p, "EVALUATION", 552, 18, 2, 2, 2);
  text(p, "SHIP", 824, 18, 2, 2, 2);

  line(p, 46, 88, 910, 88, 3);
  for (let i = 0; i < stations.length - 1; i++) arrow(p, stations[i + 1] - 24, 88, 3);
  stations.forEach((x, i) => {
    circle(p, x, 88, i === 2 ? 9 : 6, i === 2 ? 1 : 2, false);
    circle(p, x, 88, 2, i === 2 ? 1 : 2, true);
  });
  line(p, 596, 48, 596, 132, 3);
  text(p, "GATE", 579, 137, 2, 1, 1);

  const ys = [68, 88, 108];
  for (let i = 0; i < 3; i++) {
    let x, y = ys[i], state = "pending";
    if (t < 0.18) {
      x = mix(24, 112, between(t, 0.01 + i * 0.018, 0.15 + i * 0.018));
      y += Math.sin(frame * 0.9 + i * 2.2) * (5 - between(t, 0.05, 0.18) * 4);
    } else if (t < 0.43) {
      x = mix(112, 348, between(t, 0.18, 0.39));
      state = between(t, 0.31, 0.40) > 0.5 ? "owned" : "pending";
    } else if (t < 0.64) {
      x = mix(348, 602, between(t, 0.43, 0.60));
      state = "owned";
    } else if (i === 1) {
      const fall = between(t, 0.64, 0.75);
      x = 602 + fall * 25;
      y = 88 + fall * 55;
      state = "reject";
    } else {
      const passIndex = i === 0 ? 0 : 1;
      x = mix(602, 842, between(t, 0.64, 0.82));
      y = mix(ys[i], 78 + passIndex * 20, between(t, 0.66, 0.82));
      state = "pass";
    }
    token(p, x, y, i, state);
  }

  if (t >= 0.70) {
    const reveal = between(t, 0.70, 0.78);
    line(p, 596, 115, 620, 139, 5, 2);
    line(p, 620, 139, 650, 139, 5, 2);
    if (reveal > 0.45) text(p, "REJECTED 01", 660, 134, 5, 1, 1);
  }

  text(p, "OWNER: HUMAN", 281, 147, t > 0.38 ? 1 : 3, 1, 1);
  if (t > 0.80) {
    text(p, "REVIEWED 03", 690, 151, 2, 1, 1);
    text(p, "SHIPPED 02", 788, 151, 7, 1, 1);
    text(p, "REJECTED 01", 876, 151, 5, 1, 1);
  } else {
    text(p, "SYSTEM OUTPUT REQUIRES A DECISION", 690, 151, 2, 1, 1);
  }
  return p;
}

function drawMobileFrame(frame) {
  const p = canvas();
  const t = frame / FRAMES;
  const stations = [58, 234, 414, 574];

  text(p, "AI", 40, 17, 2, 3, 2); text(p, "DRAFT", 17, 42, 2, 3, 2);
  text(p, "ENGINEER", 167, 17, 2, 3, 2); text(p, "REVIEW", 185, 42, 2, 3, 2);
  text(p, "EVAL", 378, 17, 2, 3, 2); text(p, "GATE", 378, 42, 2, 3, 2);
  text(p, "SHIP", 540, 29, 2, 3, 2);

  line(p, 26, 130, 614, 130, 3);
  for (let i = 0; i < stations.length - 1; i++) arrow(p, stations[i + 1] - 18, 130, 3);
  stations.forEach((x, i) => {
    circle(p, x, 130, i === 2 ? 10 : 7, i === 2 ? 1 : 2, false);
    circle(p, x, 130, 2, i === 2 ? 1 : 2, true);
  });
  line(p, 414, 81, 414, 190, 3);

  const ys = [106, 130, 154];
  for (let i = 0; i < 3; i++) {
    let x, y = ys[i], state = "pending";
    if (t < 0.18) {
      x = mix(8, 64, between(t, 0.01 + i * 0.018, 0.15 + i * 0.018));
      y += Math.sin(frame * 0.9 + i * 2.2) * (6 - between(t, 0.05, 0.18) * 5);
    } else if (t < 0.43) {
      x = mix(64, 240, between(t, 0.18, 0.39));
      state = between(t, 0.31, 0.40) > 0.5 ? "owned" : "pending";
    } else if (t < 0.64) {
      x = mix(240, 420, between(t, 0.43, 0.60)); state = "owned";
    } else if (i === 1) {
      const fall = between(t, 0.64, 0.75);
      x = 420 + fall * 18; y = 130 + fall * 62; state = "reject";
    } else {
      const passIndex = i === 0 ? 0 : 1;
      x = mix(420, 570, between(t, 0.64, 0.82));
      y = mix(ys[i], 116 + passIndex * 28, between(t, 0.66, 0.82)); state = "pass";
    }
    token(p, x, y, i, state);
  }

  text(p, "OWNER: HUMAN", 188, 205, t > 0.38 ? 1 : 3, 2, 1);
  if (t >= 0.70) {
    line(p, 414, 166, 437, 192, 5, 2);
  }
  if (t > 0.80) {
    text(p, "REVIEWED 03", 28, 235, 2, 2, 1);
    text(p, "SHIPPED 02", 245, 235, 7, 2, 1);
    text(p, "REJECTED 01", 440, 235, 5, 2, 1);
  } else {
    text(p, "OUTPUT REQUIRES A DECISION", 169, 235, 2, 2, 1);
  }
  return p;
}

function u16(n) { return [n & 255, (n >> 8) & 255]; }

function lzw(data, minCodeSize = 4) {
  const clear = 1 << minCodeSize;
  const end = clear + 1;
  let codeSize = minCodeSize + 1;
  let nextCode = end + 1;
  let dict = new Map();
  const bytes = [];
  let current = 0, bits = 0;
  const emit = (code) => {
    current |= code << bits; bits += codeSize;
    while (bits >= 8) { bytes.push(current & 255); current >>= 8; bits -= 8; }
  };
  const reset = () => { dict = new Map(); codeSize = minCodeSize + 1; nextCode = end + 1; };
  emit(clear);
  let prefix = data[0];
  for (let i = 1; i < data.length; i++) {
    const k = data[i];
    const key = `${prefix},${k}`;
    if (dict.has(key)) {
      prefix = dict.get(key);
    } else {
      emit(prefix);
      if (nextCode < 4096) {
        dict.set(key, nextCode++);
        // The decoder builds each dictionary entry one emitted code later than
        // the encoder. Advance the bit width only after crossing the boundary,
        // otherwise the next code is packed one bit too wide.
        if (nextCode === (1 << codeSize) + 1 && codeSize < 12) codeSize++;
      } else {
        emit(clear); reset();
      }
      prefix = k;
    }
  }
  emit(prefix); emit(end);
  if (bits > 0) bytes.push(current & 255);
  return bytes;
}

function makeGif(palette, draw = drawFrame, frameCount = FRAMES) {
  const out = [];
  const push = (...xs) => out.push(...xs);
  push(...Buffer.from("GIF89a"), ...u16(WIDTH), ...u16(HEIGHT), 0xF3, 0, 0);
  palette.forEach(([r,g,b]) => push(r,g,b));
  push(0x21,0xFF,0x0B,...Buffer.from("NETSCAPE2.0"),0x03,0x01,0x00,0x00,0x00);
  for (let f = 0; f < frameCount; f++) {
    const delay = Math.round(100 / FPS);
    push(0x21,0xF9,0x04,0x04,...u16(delay),0x00,0x00);
    push(0x2C,0,0,0,0,...u16(WIDTH),...u16(HEIGHT),0x00);
    push(0x04);
    const encoded = lzw(draw(f));
    for (let i = 0; i < encoded.length; i += 255) {
      const block = encoded.slice(i, i + 255); push(block.length, ...block);
    }
    push(0x00);
  }
  push(0x3B);
  return Buffer.from(out);
}

const target = resolve("assets/github-readme");
mkdirSync(target, { recursive: true });
for (const [name, palette] of Object.entries(themes)) {
  WIDTH = 960; HEIGHT = 180;
  const desktop = resolve(target, `evaluation-loop-${name}.gif`);
  const desktopStill = resolve(target, `evaluation-loop-still-${name}.gif`);
  writeFileSync(desktop, makeGif(palette));
  writeFileSync(desktopStill, makeGif(palette, () => drawFrame(84), 1));
  WIDTH = 640; HEIGHT = 260;
  const mobile = resolve(target, `evaluation-loop-mobile-${name}.gif`);
  const mobileStill = resolve(target, `evaluation-loop-mobile-still-${name}.gif`);
  writeFileSync(mobile, makeGif(palette, drawMobileFrame));
  writeFileSync(mobileStill, makeGif(palette, () => drawMobileFrame(84), 1));
  console.log(desktop, mobile);
}

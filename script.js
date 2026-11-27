
// The Kieth Generator

const assets = {
  background: [],

  base: [
    { name: "Default Body", file: "body base.png" }
  ],

  hair: [
    { name: "Hair 1", file: "hair-1.png" },
    { name: "Hair 2", file: "hair-2.png" }
  ],

  eyes: [
    { name: "Eyes 1", file: "eyes-1.png" },
    { name: "Eyes 2", file: "eyes-2.png" },
    { name: "Eyes 3", file: "eyes-3.png" },
    { name: "Eyes 4", file: "eyes-4.png" },
    { name: "Eyes 5", file: "eyes-5.png" },
    { name: "Eyes 6", file: "eyes-6.png" },
    { name: "Eyes 7", file: "eyes-7.png" },
    { name: "Eyes 8", file: "eyes-8.png" }
  ],

  hand: [
    { name: "Hand 1", file: "hand-1.png" },
    { name: "Hand 2", file: "hand-2.png" }
  ],

  mouth: [
    { name: "Mouth 1", file: "mouth-1.png" },
    { name: "Mouth 2", file: "mouth-2.png" },
    { name: "Mouth 3", file: "mouth-3.png" },
    { name: "Mouth 4", file: "mouth-4.png" },
    { name: "Mouth 5", file: "mouth-5.png" },
    { name: "Mouth 6", file: "mouth-6.png" }
  ],

  clothing: [
    { name: "Clothing 1", file: "cloth-1.png" },
    { name: "Clothing 2", file: "cloth-2.png" },
    { name: "Clothing 3", file: "cloth-3.png" }
  ],

  accessories: [
    { name: "Accessory 1", file: "accessory-1.png" },
    { name: "Accessory 2", file: "accessory-2.png" }
  ],

  effects: [
    { name: "Effect 1", file: "effect-1.png" },
    { name: "Effect 2", file: "effect-2.png" },
    { name: "Effect 3", file: "effect-3.png" },
    { name: "Effect 4", file: "effect-4.png" },
    { name: "Effect 5", file: "effect-5.png" }
  ]
};

const canvas = document.getElementById("avatarCanvas");
const ctx = canvas.getContext("2d");
const controls = document.getElementById("controls");

const selections = {};
let backgroundColor = "#ffffff";
let wheelHue = 0;
let wheelSaturation = 1;
let wheelBrightness = 100;

const folderNames = {
  background: "background",
  base: "base",
  hair: "hair",
  eyes: "eyes",
  hand: "hand",
  mouth: "mouth",
  clothing: "clothing",
  accessories: "accessories",
  effects: "effects"
};

// Convert HSV color values to a HEX color
function hsvToHex(h, s, v) {
  const f = (n, k = (n + h / 60) % 6) =>
    v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);

  const toHex = value =>
    Math.round(value * 255).toString(16).padStart(2, "0");

  return "#" + toHex(f(5)) + toHex(f(3)) + toHex(f(1));
}

// Draw the circular color wheel
function drawColorWheel(wheel) {
  const wheelCtx = wheel.getContext("2d");
  const size = wheel.width;
  const center = size / 2;
  const radius = center;
  const imageData = wheelCtx.createImageData(size, size);
  const pixels = imageData.data;
  const brightness = wheelBrightness / 100;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = (x - center) / radius;
      const dy = (y - center) / radius;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const index = (y * size + x) * 4;

      if (distance <= 1) {
        const hue =
          (Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360;

        const color = hsvToHex(
          hue,
          Math.min(distance, 1),
          brightness
        );

        pixels[index] = parseInt(color.slice(1, 3), 16);
        pixels[index + 1] = parseInt(color.slice(3, 5), 16);
        pixels[index + 2] = parseInt(color.slice(5, 7), 16);
        pixels[index + 3] = 255;
      }
    }
  }

  wheelCtx.putImageData(imageData, 0, 0);
}

// Build customization menus
function createControls() {
  controls.innerHTML = "";

  Object.keys(assets).forEach(category => {
    const items = assets[category];

    if (items.length === 0) return;

    const group = document.createElement("div");
    group.className = "control-group";

    const label = document.createElement("label");
    label.textContent =
      category.charAt(0).toUpperCase() + category.slice(1);

    const select = document.createElement("select");
    select.id = "select-" + category;

    if (category !== "base") {
      const none = document.createElement("option");
      none.value = "";
      none.textContent = "None";
      select.appendChild(none);
    }

    items.forEach((item, index) => {
      const option = document.createElement("option");
      option.value = index;
      option.textContent = item.name;
      select.appendChild(option);
    });

    selections[category] = category === "base" ? "0" : "";
    select.value = selections[category];

    select.addEventListener("change", () => {
      selections[category] = select.value;
      renderAvatar();
    });

    group.appendChild(label);
    group.appendChild(select);
    controls.appendChild(group);
  });

  // Background color picker, placed at the bottom
  const colorGroup = document.createElement("div");
  colorGroup.className = "control-group background-picker";

  const colorTitle = document.createElement("label");
  colorTitle.textContent = "Background Color";

  const wheel = document.createElement("canvas");
  wheel.id = "colorWheel";
  wheel.width = 220;
  wheel.height = 220;

  const colorValue = document.createElement("div");
  colorValue.id = "selectedColor";
  colorValue.textContent = backgroundColor;

  const brightnessLabel = document.createElement("label");
  brightnessLabel.textContent = "Brightness";

  const brightness = document.createElement("input");
  brightness.type = "range";
  brightness.min = "20";
  brightness.max = "100";
  brightness.value = wheelBrightness;
  brightness.id = "colorBrightness";

  brightness.addEventListener("input", () => {
    wheelBrightness = Number(brightness.value);
    drawColorWheel(wheel);
    updateBackgroundColor();
  });

  function chooseColor(event) {
    const rect = wheel.getBoundingClientRect();
    const scaleX = wheel.width / rect.width;
    const scaleY = wheel.height / rect.height;

    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    const center = wheel.width / 2;
    const dx = x - center;
    const dy = y - center;

    const distance = Math.min(
      Math.sqrt(dx * dx + dy * dy) / center,
      1
    );

    wheelHue =
      (Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360;

    wheelSaturation = distance;

    updateBackgroundColor();
  }

  wheel.addEventListener("pointerdown", event => {
    wheel.setPointerCapture(event.pointerId);
    chooseColor(event);
  });

  wheel.addEventListener("pointermove", event => {
    if (event.buttons === 1) {
      chooseColor(event);
    }
  });

  function updateBackgroundColor() {
    backgroundColor = hsvToHex(
      wheelHue,
      wheelSaturation,
      wheelBrightness / 100
    );

    colorValue.textContent = backgroundColor;
    colorValue.style.backgroundColor = backgroundColor;
    renderAvatar();
  }

  drawColorWheel(wheel);

  colorGroup.appendChild(colorTitle);
  colorGroup.appendChild(wheel);
  colorGroup.appendChild(colorValue);
  colorGroup.appendChild(brightnessLabel);
  colorGroup.appendChild(brightness);

  controls.appendChild(colorGroup);
}

// Load a PNG from GitHub
function loadImage(category, filename) {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);

    image.onerror = () => {
      reject(new Error("Could not load " + filename));
    };

    image.src =
      "assets/" + folderNames[category] + "/" + filename;
  });
}

// Draw all selected layers
async function renderAvatar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the selected background color first
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const layerOrder = [
    "background",
    "base",
    "hair",
    "clothing",
    "eyes",
    "hand",
    "mouth",
    "accessories",
    "effects"
  ];

  for (const category of layerOrder) {
    const selected = selections[category];

    if (selected === undefined || selected === "") continue;

    const item = assets[category][Number(selected)];

    if (!item) continue;

    try {
      const image = await loadImage(category, item.file);

      ctx.drawImage(
        image,
        0,
        0,
        canvas.width,
        canvas.height
      );
    } catch (error) {
      console.error(error.message);
    }
  }
}

// Randomize available character options
function randomizeAvatar() {
  Object.keys(assets).forEach(category => {
    const items = assets[category];

    if (items.length === 0) return;

    if (category === "base") {
      selections[category] =
        String(Math.floor(Math.random() * items.length));
    } else {
      const randomIndex =
        Math.floor(Math.random() * (items.length + 1));

      selections[category] =
        randomIndex === items.length ? "" : String(randomIndex);
    }

    const select = document.getElementById("select-" + category);

    if (select) {
      select.value = selections[category];
    }
  });

  renderAvatar();
}

// Reset avatar and background color
function resetAvatar() {
  Object.keys(assets).forEach(category => {
    selections[category] = category === "base" ? "0" : "";

    const select = document.getElementById("select-" + category);

    if (select) {
      select.value = selections[category];
    }
  });

  backgroundColor = "#ffffff";
  wheelHue = 0;
  wheelSaturation = 1;
  wheelBrightness = 100;

  const wheel = document.getElementById("colorWheel");
  const brightness = document.getElementById("colorBrightness");
  const colorValue = document.getElementById("selectedColor");

  if (wheel) drawColorWheel(wheel);
  if (brightness) brightness.value = 100;

  if (colorValue) {
    colorValue.textContent = backgroundColor;
    colorValue.style.backgroundColor = backgroundColor;
  }

  renderAvatar();
}

// Download avatar as PNG
function downloadAvatar() {
  const link = document.createElement("a");

  link.download = "my-keith.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

// Button actions
document.getElementById("randomize")
  .addEventListener("click", randomizeAvatar);

document.getElementById("reset")
  .addEventListener("click", resetAvatar);

document.getElementById("download")
  .addEventListener("click", downloadAvatar);

// Start the avatar maker
createControls();
renderAvatar();

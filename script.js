
// The Kieth Generator
// Add new PNG filenames to the lists below as you upload them.

const assets = {
  background: [],

  base: [
    {
      name: "Default Body",
      file: "body base.png"
    }
  ],

  hair: [
    {
      name: "Hair 1",
      file: "hair-1.png"
    },
    {
      name: "Hair 2",
      file: "hair-2.png"
    }
  ],
  
  eyes: [
        {
      name: "Eyes 1",
      file: "eyes-1.png"
    },
    {
      name: "Eyes 2",
      file: "eyes-2.png"
    },
    {
      name: "Eyes 3",
      file: "eyes-3.png"
    },
    {
      name: "Eyes 4",
      file: "eyes-4.png"
    },
    {
      name: "Eyes 5",
      file: "eyes-5.png"
    },
    {
      name: "Eyes 6",
      file: "eyes-6.png"
    },
    {
      name: "Eyes 7",
      file: "eyes-7.png."
    },
    {
      name: "Eyes 8",
      file: "eyes-8.png"
    }
  ],
  
  hands: [
    {
      name: "Hand 1",
      file: "hand-1.png"
    },
    {
      name: "Hand 2",
      file: "hand-2.png"
    }
  ],
  
  mouths: [
    {
      name: "Mouth 1",
      file: "mouth-1.png"
    },
    {
      name: "Mouth 2",
      file: "mouth-2.png"
    },
    {
      name: "Mouth 3",
      file: "mouth-3.png"
    },
    {
      name: "Mouth 4",
      file: "mouth-4.png"
    },
    {
      name: "Mouth 5",
      file: "mouth-5.png"
    },
    {
      name: "Mouth 6",
      file: "mouth-6.png"
    }
  ],

  clothing: [
    {
      name: "Clothing 1",
      file: "cloth-1.png"
    },
    {
      name: "Clothing 2",
      file: "cloth-2.png"
    },
    {
      name: "Clothing 3",
      file: "cloth-3.png"
    }
  ],

  accessories: [
    {
      name: "Accessory 1",
      file: "accessory-1.png"
    },
    {
      name: "Accessory 2",
      file: "accessory-2.png"
    }
  ],

  effects: [
    {
      name: "Effect 1",
      file: "effect-1.png"
    },
    {
      name: "Effect 2",
      file: "effect-2.png"
    },
    {
      name: "Effect 3",
      file: "effect-3.png"
    },
    {
      name: "Effect 4",
      file: "effect-4.png"
    },
    {
      name: "Effect 5",
      file: "effect-5.png"
    }
  ]
};

const canvas = document.getElementById("avatarCanvas");
const ctx = canvas.getContext("2d");
const controls = document.getElementById("controls");

const selections = {};

const folderNames = {
  background: "background",
  base: "base",
  hair: "hair",
  eyes: "eyes",
  eyebrows: "eyebrows",
  mouths: "mouths",
  clothing: "clothing",
  accessories: "accessories",
  effects: "effects"
};

// Build customization menus
function createControls() {
  controls.innerHTML = "";

  Object.keys(assets).forEach(category => {
    const items = assets[category];

    // Skip categories without uploaded artwork
    if (items.length === 0) return;

    const group = document.createElement("div");
    group.className = "control-group";

    const label = document.createElement("label");
    label.textContent = category.charAt(0).toUpperCase()
      + category.slice(1);

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

    // Default to the first body, no other layers
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

  // Background first, then body and other layers
  const layerOrder = [
    "background",
    "base",
    "hair",
    "clothing",
    "eyes",
    "eyebrows",
    "mouths",
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

      // Draw every layer across the same canvas.
      // Your PNG files should share the same canvas dimensions
      // and character alignment for best results.
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

// Randomize available options
function randomizeAvatar() {
  Object.keys(assets).forEach(category => {
    const items = assets[category];

    if (items.length === 0) return;

    if (category === "base") {
      selections[category] =
        String(Math.floor(Math.random() * items.length));
    } else {
      const randomIndex = Math.floor(
        Math.random() * (items.length + 1)
      );

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

// Reset to default
function resetAvatar() {
  Object.keys(assets).forEach(category => {
    selections[category] = category === "base" ? "0" : "";

    const select = document.getElementById("select-" + category);

    if (select) {
      select.value = selections[category];
    }
  });

  renderAvatar();
}

// Download avatar as PNG
function downloadAvatar() {
  const link = document.createElement("a");

  link.download = "my-little-avatar.png";
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

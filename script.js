
const categories = {
  base: [
    { name: "Default Body", file: "default.png" }
  ],
  hair: [],
  eyes: [],
  outfits: [],
  accessories: []
};

const avatar = document.getElementById("avatar");

const layers = {};

function createControls() {
  Object.keys(categories).forEach(category => {
    const select = document.getElementById(category);

    if (!select) return;

    select.innerHTML = "";

    categories[category].forEach(item => {
      const option = document.createElement("option");
      option.value = item.file;
      option.textContent = item.name;
      select.appendChild(option);
    });

    select.addEventListener("change", updateAvatar);
  });
}

function updateAvatar() {
  avatar.innerHTML = "";

  Object.keys(categories).forEach(category => {
    const select = document.getElementById(category);
    if (!select || !select.value) return;

    const img = document.createElement("img");
    img.src = `assets/${category}/${select.value}`;
    img.alt = category;

    avatar.appendChild(img);
  });
}

document.getElementById("download").addEventListener("click", () => {
  alert("Your download feature will be added next!");
});

createControls();

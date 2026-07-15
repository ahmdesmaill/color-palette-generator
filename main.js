const form = document.getElementById("get-colors-form");
const colorPickerEl = document.getElementById("color-picker");
const schemeModeEl = document.getElementById("scheme-mode");
const colorsContainer = document.getElementById("colors")
let colorsToRender = [
  "#F55A5A",
  "#2B283A",
  "#FBF3AB",
  "#AAD1B6",
  "#A626D3"
];

function renderColors() {
  colorsContainer.innerHTML = "";
  colorsToRender.forEach(color => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("color");

    const swatch = document.createElement("div");
    swatch.style.backgroundColor = color;

    const label = document.createElement("p");
    label.textContent = color;

    wrapper.append(swatch, label);
    colorsContainer.append(wrapper);
  });
}

const hexPattern = /^#[0-9A-Fa-f]{6}$/;

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  if (!hexPattern.test(formData.get("color"))) return;

  fetch(`https://www.thecolorapi.com/scheme?hex=${formData.get("color").substring(1)}&count=5&format=json&mode=${formData.get("scheme-mode")}`)
    .then(res => res.json())
    .then(data => {
      colorsToRender = [];
      data.colors.forEach(color => {
        const hex = color.hex.value;
        if (hexPattern.test(hex)) colorsToRender.push(hex);
      });
      renderColors();
    });
})

renderColors();

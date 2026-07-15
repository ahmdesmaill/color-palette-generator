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
  let html = "";
  colorsToRender.forEach(color => {
    html += `
    <div class="color">
        <div style="background-color: ${color};"></div>
        <p>${color}</p>
    </div>
    `;
  });
  colorsContainer.innerHTML = html;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  fetch(`https://www.thecolorapi.com/scheme?hex=${formData.get("color").substring(1)}&count=5&format=json&mode=${formData.get("scheme-mode")}`)
    .then(res => res.json())
    .then(data => {
      colorsToRender = [];
      data.colors.forEach(color => {
        colorsToRender.push(color.hex.value);
      });
      renderColors();
    });
})

renderColors();

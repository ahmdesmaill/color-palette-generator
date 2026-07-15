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
const hexPattern = /^#[0-9A-Fa-f]{6}$/;

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

async function fetchData(url, options) {
  try {
    const result = await fetch(url, options);
    if (!result.ok) {
      // Try to extract the error body if the API returns JSON details
      const errorBody = await result.json().catch(() => null);
      throw new Error(
        `HTTP Error: Status: ${result.status}, message: ${errorBody?.message || result.statusText}.`
      );
    }

    const data = await result.json();
    return { errorOrData: data, success: true };

  } catch (error) {
    console.error("Fetch operation failed:", error.message);
    return { errorOrData: error.message, success: false };
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  if (!hexPattern.test(formData.get("color"))) return;
  const { errorOrData, success } = await fetchData(`https://www.thecolorapi.com/scheme?hex=${formData.get("color").substring(1)}&count=5&format=json&mode=${formData.get("scheme-mode")}`);
  if (success && errorOrData && errorOrData?.colors) {
    colorsToRender = [];
    errorOrData.colors.forEach(color => {
      const hex = color.hex.value;
      if (hexPattern.test(hex)) colorsToRender.push(hex);
    });
    renderColors();
  } else {
    alert(`It looks like there is a problem at the moment, please try again later. Error Message: ${errorOrData}`);
  }
})

renderColors();

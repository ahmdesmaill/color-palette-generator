const form = document.getElementById("get-colors-form");
const colorsContainer = document.getElementById("colors")
const hoverBox = document.getElementById("hover-box");
let colorsToRender = [
  "#F55A5A",
  "#2B283A",
  "#FBF3AB",
  "#AAD1B6",
  "#A626D3"
];
const touchDevicesLabel = document.getElementById("touch-devices-label");
const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
const hexPattern = /^#[0-9A-Fa-f]{6}$/;

function showErrorToast(message) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.setAttribute("role", "alert");
    document.body.append(toast);
  }
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toast._timer) // This won't error if _timer is still undefined;
  toast._timer = setTimeout(() => toast.classList.remove("visible"), 3500);
}

async function copyColor(color, event, element) {
  try {
    await navigator.clipboard.writeText(color);
    let originX, originY;
    if (event.clientX && event.clientY) {
      originX = event.clientX / window.innerWidth;
      originY = event.clientY / window.innerHeight;
    } else {
      const rect = element.getBoundingClientRect();
      originX = (rect.left + rect.width / 2) / window.innerWidth;
      originY = (rect.top + rect.height / 2) / window.innerHeight;
    }
    confetti({
      particleCount: 50,
      spread: 25,
      colors: ["#ffffff", "#ffeb3b"],
      origin: { x: originX, y: originY },
      gravity: 1.5,
      decay: 0.87,
      ticks: 160,
    });
  } catch (error) {
    showErrorToast(`Failed to copy ${color}: ${error.message}`);
  }
}

function renderColors() {
  colorsContainer.innerHTML = "";
  colorsToRender.forEach(color => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("color");

    const swatch = document.createElement("div");
    swatch.setAttribute("aria-label", `Copy color ${color}`);
    swatch.setAttribute("role", "button");
    swatch.setAttribute("tabindex", "0");
    swatch.style.backgroundColor = color;

    if (!isTouchDevice) {
      // Hover box
      swatch.addEventListener("mousemove", (event) => {
        hoverBox.style.display = 'flex';
        // Move it to the mouse coordinates + the offset from the hover-box CSS transform property
        hoverBox.style.left = `${event.clientX}px`;
        hoverBox.style.top = `${event.clientY}px`;
      })
      swatch.addEventListener('mouseleave', (event) => {
        hoverBox.style.display = 'none';
      });
    }

    // Color copying
    swatch.addEventListener("click", (event) => {
      copyColor(color, event, swatch);
    });
    swatch.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        copyColor(color, event, swatch);
      }
    });

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

function main() {
  renderColors();

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    if (!hexPattern.test(formData.get("color"))) return;
    const { errorOrData, success } = await fetchData(`https://www.thecolorapi.com/scheme?hex=${formData.get("color").substring(1)}&count=5&format=json&mode=${formData.get("scheme-mode")}`);
    if (success && errorOrData?.colors) {
      colorsToRender = [];
      errorOrData.colors.forEach(color => {
        const hex = color.hex.value;
        if (hexPattern.test(hex)) colorsToRender.push(hex);
      });
      renderColors();
    } else {
      showErrorToast(`It looks like there is a problem at the moment, please try again later. Error Message: ${errorOrData}`);
    }
  })

  if (isTouchDevice) {
    touchDevicesLabel.style.display = "Block";
  }
}

main();

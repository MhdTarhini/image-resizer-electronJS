const form = document.querySelector("#img-form");
const heightInput = document.querySelector("#height");
const widthInput = document.querySelector("#width");
const outputPath = document.querySelector("#output-path");
const img = document.querySelector("#img");

// console.log(versions.chrome());
function loadImage(e) {
  const file = e.target.files[0];

  if (!isFileImage(file)) {
    alertError("Please select an image file");
    return;
  }

  const image = new Image();
  image.src = URL.createObjectURL(file);
  image.onload = function () {
    widthInput.value = this.width;
    heightInput.value = this.height;
  };

  form.style.display = "block";
  document.querySelector("#filename").innerHTML = file.name;
  outputPath.innerText = path.join(os.homedir(), "imageresizer");
}

//send image data to main
function sendImage(e) {
  e.preventDefault();
  const width = widthInput.value;
  const height = heightInput.value;
  const img_path = img.files[0].path;

  if (!img.files[0]) {
    alertError("Please uplaod an image");
    return;
  }
  if (width === "" || height === "") {
    alertError("Please fill in a height and width");
  }

  // send to main using ipcRenderer
  ipcRenderer.send("image:resize", {
    img_path,
    width,
    height,
  });
}

// Catch the image:done event
ipcRenderer.on("imge:done", () => {
  alertSuccess(`Image resized to ${widthInput.value} x ${heightInput.value}`);
});

function isFileImage(file) {
  const acceptedImageTypes = ["image/gif", "image/jpeg", "image/png"];
  return file && acceptedImageTypes.includes(file["type"]);
}
function alertError(message) {
  toastify.toast({
    text: message,
    duration: 5000,
    close: false,
    style: {
      background: "red",
      color: "white",
      textAlign: "center",
    },
  });
}
function alertSuccess(message) {
  Toastify.toast({
    text: message,
    duration: 5000,
    close: false,
    style: {
      background: "green",
      color: "white",
      textAlign: "center",
    },
  });
}

img.addEventListener("change", loadImage);

form.addEventListener("submit", sendImage);

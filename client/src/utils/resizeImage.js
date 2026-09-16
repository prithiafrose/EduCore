export function resizeImageToDataUrl(file, maxSize = 512) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith("image/")) {
      reject(new Error("Please choose an image file."));
      return;
    }

    const reader = new FileReader();

    reader.onerror = () =>
      reject(new Error("Failed to read the image file."));

    reader.onload = () => {
      const img = new Image();

      img.onerror = () =>
        reject(new Error("The selected file is not a valid image."));

      img.onload = () => {
        let { width, height } = img;

        const scale = Math.min(1, maxSize / Math.max(width, height));

        width = Math.max(1, Math.round(width * scale));
        height = Math.max(1, Math.round(height * scale));

        const canvas = document.createElement("canvas");

        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d");

        context.drawImage(img, 0, 0, width, height);

        const type =
          file.type === "image/png" || file.type === "image/webp"
            ? file.type
            : "image/jpeg";

        resolve(canvas.toDataURL(type, 0.85));
      };

      img.src = reader.result;
    };

    reader.readAsDataURL(file);
  });
}
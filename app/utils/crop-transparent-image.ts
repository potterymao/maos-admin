export function cropTransparentImage(dataUrl: unknown, paddingRatio = 0.01) {
  return new Promise<string>((resolve) => {
    if (typeof dataUrl !== "string" || !dataUrl) {
      resolve("");
      return;
    }

    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) {
        resolve(dataUrl);
        return;
      }

      context.drawImage(image, 0, 0);
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
      let hasTransparency = false;
      for (let index = 3; index < pixels.length; index += 4) {
        if (pixels[index] < 245) {
          hasTransparency = true;
          break;
        }
      }

      const cornerIndexes = [
        0,
        (canvas.width - 1) * 4,
        (canvas.height - 1) * canvas.width * 4,
        (canvas.height * canvas.width - 1) * 4,
      ];
      const background = [0, 1, 2].map((channel) =>
        cornerIndexes.reduce((sum, index) => sum + pixels[index + channel], 0) / cornerIndexes.length,
      );
      let minX = canvas.width;
      let minY = canvas.height;
      let maxX = -1;
      let maxY = -1;

      for (let y = 0; y < canvas.height; y += 1) {
        for (let x = 0; x < canvas.width; x += 1) {
          const index = (y * canvas.width + x) * 4;
          const alpha = pixels[index + 3];
          const colorDistance = Math.abs(pixels[index] - background[0])
            + Math.abs(pixels[index + 1] - background[1])
            + Math.abs(pixels[index + 2] - background[2]);
          const isContent = hasTransparency ? alpha > 8 : colorDistance > 12;
          if (!isContent) continue;
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        }
      }

      if (maxX < minX || maxY < minY) {
        resolve(dataUrl);
        return;
      }

      const contentWidth = maxX - minX + 1;
      const contentHeight = maxY - minY + 1;
      const padding = Math.ceil(Math.max(contentWidth, contentHeight) * paddingRatio);
      const sourceX = Math.max(0, minX - padding);
      const sourceY = Math.max(0, minY - padding);
      const sourceWidth = Math.min(canvas.width - sourceX, contentWidth + padding * 2);
      const sourceHeight = Math.min(canvas.height - sourceY, contentHeight + padding * 2);

      if (sourceWidth >= canvas.width * 0.98 && sourceHeight >= canvas.height * 0.98) {
        resolve(dataUrl);
        return;
      }

      const cropped = document.createElement("canvas");
      cropped.width = sourceWidth;
      cropped.height = sourceHeight;
      cropped.getContext("2d")?.drawImage(
        canvas,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        0,
        0,
        sourceWidth,
        sourceHeight,
      );
      resolve(cropped.toDataURL("image/png"));
    };
    image.onerror = () => resolve(dataUrl);
    image.src = dataUrl;
  });
}

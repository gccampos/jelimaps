export function getImageDimensions(url) {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.onload = () => {
      let maxDimension = Math.max(img.width, img.height);
      resolve({
        width: (img.width / maxDimension).toFixed(1),
        height: (img.height / maxDimension).toFixed(1),
      });
    };
    img.onerror = reject;
    img.src = url;
  });
}

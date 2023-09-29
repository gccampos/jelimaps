function UrlResolver(url: string): string {
  const regeXGoogleDrive =
    /https:\/\/drive\.google\.com\/file\/d\/([^/]+)\/view/;
  switch (true) {
    case regeXGoogleDrive.test(url):
      url = `https://drive.google.com/uc?export=view&id=${url.match(
        regeXGoogleDrive
      )}`;
      break;
  }
  return url;
}

const ImageUrlResolverReturn = {
  UrlResolver,
};

export default ImageUrlResolverReturn;

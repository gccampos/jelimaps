function UrlResolver(url: string): string {
  const regeXGoogleDrive =
    /https:\/\/drive\.google\.com\/file\/d\/([^/]+)\/view/;
  switch (true) {
    case regeXGoogleDrive.test(url):
      url = `https://lh3.googleusercontent.com/d/${
        url.match(regeXGoogleDrive)[1]
      }`;
      break;
  }
  return url;
}
const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

const ImageUrlResolverReturn = {
  UrlResolver,
  isValidUrl,
};

export default ImageUrlResolverReturn;

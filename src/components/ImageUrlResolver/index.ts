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
const isValidUrl = async (url: string) => {
  try {
    const link = new URL(url);
    await fetch(link).then((x) => x);
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

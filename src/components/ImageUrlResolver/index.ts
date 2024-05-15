async function UrlResolver(url: string): Promise<string> {
  const regeXGoogleDrive =
    /https:\/\/drive\.google\.com\/file\/d\/([^/]+)\/view/;
  const regeXWikiPedia =
    /https:\/\/\S*\.wikipedia\.org\S*\/media\/\S*:(\S*\.\S{3})/;
  switch (true) {
    case regeXGoogleDrive.test(url):
      url = `https://lh3.googleusercontent.com/d/${
        url.match(regeXGoogleDrive)[1]
      }`;
      break;
    case regeXWikiPedia.test(url):
      url = await fetch(url)
        .then((x) => x.text())
        .then((x) => {
          var parser = new DOMParser();
          var doc = parser.parseFromString(x, "text/html");
          var imageUrl = Array.from(doc.querySelectorAll("img"))
            .map((x) => x.src)
            .find((x) => x.includes(url.match(regeXWikiPedia)[1]));

          return (
            imageUrl
              ?.replace("/thumb", "")
              .replace(/\/\d{3}px\S*\.\S{3}$/, "") ?? url
          );
        })
        .catch(function () {
          return url;
        });
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

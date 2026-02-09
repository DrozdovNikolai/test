type WaitForImagesOptions = {
  root?: Document | HTMLElement;
  timeoutMs?: number;
  includeBackgrounds?: boolean;
  additionalUrls?: string[];
};

const extractUrlsFromCss = (value: string) => {
  const urls: string[] = [];
  const regex = /url\((['"]?)(.*?)\1\)/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(value)) !== null) {
    if (match[2]) {
      urls.push(match[2]);
    }
  }

  return urls;
};

const parseSrcset = (srcset: string) =>
  srcset
    .split(',')
    .map(entry => entry.trim().split(/\s+/)[0])
    .filter(Boolean);

const shouldSkipUrl = (url: string) =>
  !url || url.startsWith('data:') || url.startsWith('blob:');

const preloadImage = (src: string) =>
  new Promise<void>(resolve => {
    if (shouldSkipUrl(src)) {
      resolve();
      return;
    }

    const img = new Image();
    const done = () => resolve();

    img.onload = done;
    img.onerror = done;
    img.src = src;
  });

const waitForImageElement = (img: HTMLImageElement) =>
  new Promise<void>(resolve => {
    if (img.complete) {
      resolve();
      return;
    }

    const done = () => {
      img.removeEventListener('load', done);
      img.removeEventListener('error', done);
      resolve();
    };

    img.addEventListener('load', done);
    img.addEventListener('error', done);

    if (img.loading === 'lazy') {
      img.loading = 'eager';
    }
  });

export const waitForImages = async ({
  root = document,
  timeoutMs = 12000,
  includeBackgrounds = true,
  additionalUrls = []
}: WaitForImagesOptions = {}) => {
  await new Promise(requestAnimationFrame);

  const imageElements = Array.from(root.querySelectorAll('img'));
  const imagePromises = imageElements.map(waitForImageElement);

  const urls = new Set<string>();

  imageElements.forEach(img => {
    const src = img.currentSrc || img.src;
    if (src && !shouldSkipUrl(src)) {
      urls.add(src);
    }

    if (img.srcset) {
      parseSrcset(img.srcset).forEach(candidate => {
        if (!shouldSkipUrl(candidate)) {
          urls.add(candidate);
        }
      });
    }
  });

  if (includeBackgrounds) {
    Array.from(root.querySelectorAll('*')).forEach(element => {
      const style = getComputedStyle(element);
      const backgrounds = [style.backgroundImage, style.maskImage];

      backgrounds.forEach(value => {
        if (value && value !== 'none') {
          extractUrlsFromCss(value).forEach(url => {
            if (!shouldSkipUrl(url)) {
              urls.add(url);
            }
          });
        }
      });
    });
  }

  additionalUrls.forEach(url => {
    if (!shouldSkipUrl(url)) {
      urls.add(url);
    }
  });

  const preloadPromises = Array.from(urls).map(preloadImage);
  const allPromises = [...imagePromises, ...preloadPromises];

  if (allPromises.length === 0) {
    return;
  }

  await Promise.race([
    Promise.allSettled(allPromises),
    new Promise(resolve => setTimeout(resolve, timeoutMs))
  ]);
};

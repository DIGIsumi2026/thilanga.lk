export const getYouTubeVideoId = (url:string) => {
  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.hostname.includes('youtu.be')) {
      return parsedUrl.pathname.replace('/','');
    }

    if (parsedUrl.pathname.includes('/shorts/')) {
      return parsedUrl.pathname.split('/shorts/')[1];
    }

    if (parsedUrl.pathname.includes('/embed/')) {
      return parsedUrl.pathname.split('/embed/')[1];
    }

    return parsedUrl.searchParams.get('v');
  } catch {
    return null;
  }
};

export const getYouTubeThumbnail = (url:string) => {
  const videoId = getYouTubeVideoId(url);

  if (!videoId) {
    return '';
  }

  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};

export const getYouTubeFallbackThumbnail = (url:string) => {
  const videoId = getYouTubeVideoId(url);

  if (!videoId) {
    return '';
  }

  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
};

export const getYouTubeEmbedUrl = (
  url: string,
  options?: {
    autoplay?: boolean;
    muted?: boolean;
    controls?: boolean;
    loop?: boolean;
  }
) => {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return '';

  const params = new URLSearchParams({
    rel: '0',
    playsinline: '1',
    modestbranding: '1',
  });

  if (options?.autoplay) params.set('autoplay', '1');
  if (options?.muted) params.set('mute', '1');
  if (options?.controls !== undefined) params.set('controls', options.controls ? '1' : '0');
  
  if (options?.loop) {
    params.set('loop', '1');
    params.set('playlist', videoId);
  }

  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
};
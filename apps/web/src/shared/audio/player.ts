export function playBlob(blob: Blob, audioElement: HTMLAudioElement): Promise<void> {
  const url = URL.createObjectURL(blob);
  audioElement.src = url;
  audioElement.play();
  return new Promise((resolve) => {
    audioElement.onended = () => {
      URL.revokeObjectURL(url);
      resolve();
    };
  });
}

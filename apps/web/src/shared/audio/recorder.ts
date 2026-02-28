let mediaRecorder: MediaRecorder | null = null;
let audioChunks: Blob[] = [];
let stream: MediaStream | null = null;
let timerInterval: ReturnType<typeof setInterval> | null = null;

function getSupportedMimeType(): string {
  const types = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg', 'audio/mp4'];
  for (const type of types) {
    if (MediaRecorder.isTypeSupported(type)) return type;
  }
  return 'audio/webm';
}

function formatTime(ms: number): string {
  const sec = Math.floor(ms / 1000);
  const min = Math.floor(sec / 60);
  const remSec = sec % 60;
  return `${min}:${remSec.toString().padStart(2, '0')}`;
}

export async function initAudio(): Promise<MediaStream> {
  stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  return stream;
}

export async function startRecording(
  onTimerUpdate?: (time: string) => void,
): Promise<void> {
  if (!stream) {
    await initAudio();
  }

  audioChunks = [];
  mediaRecorder = new MediaRecorder(stream!, {
    mimeType: getSupportedMimeType(),
  });

  mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) {
      audioChunks.push(e.data);
    }
  };

  mediaRecorder.start(100);
  const startTime = Date.now();

  if (onTimerUpdate) {
    timerInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      onTimerUpdate(formatTime(elapsed));
    }, 100);
  }
}

export function stopRecording(): Promise<Blob | null> {
  return new Promise((resolve) => {
    if (!mediaRecorder || mediaRecorder.state === 'inactive') {
      resolve(null);
      return;
    }

    if (timerInterval) clearInterval(timerInterval);

    mediaRecorder.onstop = () => {
      const blob = new Blob(audioChunks, { type: getSupportedMimeType() });
      audioChunks = [];
      resolve(blob);
    };

    mediaRecorder.stop();
  });
}

export function getStream(): MediaStream | null {
  return stream;
}

export function cleanupAudio(): void {
  if (stream) {
    stream.getTracks().forEach((t) => t.stop());
    stream = null;
  }
  if (timerInterval) clearInterval(timerInterval);
}

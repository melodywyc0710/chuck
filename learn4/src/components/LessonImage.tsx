import { useState } from 'react';

interface Props {
  prompt: string;
  alt: string;
}

export default function LessonImage({ prompt, alt }: Props) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

  const encoded = encodeURIComponent(
    `${prompt}, educational illustration for primary school children, simple clean colorful diagram, white background, no text, textbook style`
  );
  const src = `https://image.pollinations.ai/prompt/${encoded}?width=800&height=400&nologo=true&model=flux&seed=42`;

  return (
    <div className="w-full rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 relative">
      {status === 'loading' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
          <div className="flex gap-1">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
          <span className="text-xs text-indigo-400 font-medium">Generating illustration…</span>
        </div>
      )}
      {status === 'error' && (
        <div className="h-32 flex items-center justify-center text-gray-300 text-sm">
          🎨 Illustration unavailable
        </div>
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setStatus('loaded')}
        onError={() => setStatus('error')}
        className={`w-full object-cover transition-opacity duration-500 ${status === 'loaded' ? 'opacity-100' : 'opacity-0'}`}
        style={{ maxHeight: 320 }}
      />
    </div>
  );
}

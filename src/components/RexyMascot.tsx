import React from 'react';

interface Props {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'default' | 'reading' | 'blocks' | 'science' | 'headset-live';
  mood?: 'happy' | 'thinking' | 'speaking' | 'celebrating';
}

export const RexyMascot: React.FC<Props> = ({
  className = '',
  size = 'md',
  variant = 'default',
  mood = 'happy',
}) => {
  const sizeMap = {
    xs: 'w-6 h-6',
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28',
    '2xl': 'w-40 h-40',
  };

  return (
    <div className={`relative flex items-center justify-center shrink-0 ${sizeMap[size]} ${className}`}>
      <svg
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md transition-transform duration-300 hover:scale-105"
      >
        <defs>
          <linearGradient id="rexySkinGrad" x1="40" y1="20" x2="120" y2="140" gradientUnits="userSpaceOnUse">
            <stop stopColor="#38BDF8" />
            <stop offset="0.4" stopColor="#0284C7" />
            <stop offset="1" stopColor="#0369A1" />
          </linearGradient>
          <linearGradient id="rexyBellyGrad" x1="60" y1="80" x2="100" y2="130" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F0F9FF" />
            <stop offset="0.6" stopColor="#BAE6FD" />
            <stop offset="1" stopColor="#7DD3FC" />
          </linearGradient>
          <linearGradient id="headphoneArc" x1="20" y1="40" x2="140" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0F172A" />
            <stop offset="0.5" stopColor="#1E293B" />
            <stop offset="1" stopColor="#0F172A" />
          </linearGradient>
          <linearGradient id="earCupGrad" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#0284C7" />
            <stop offset="1" stopColor="#1E40AF" />
          </linearGradient>
          <linearGradient id="glowEar" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#38BDF8" />
            <stop offset="1" stopColor="#00E5FF" />
          </linearGradient>
          <linearGradient id="bookCover" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#3B82F6" />
            <stop offset="1" stopColor="#1D4ED8" />
          </linearGradient>
          <radialGradient id="magicGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Halo */}
        <circle cx="80" cy="80" r="72" fill="url(#magicGlow)" />

        {/* Tail */}
        <path
          d="M45 125C25 125 15 105 20 95C22 93 28 100 35 105C42 110 46 112 50 115"
          fill="url(#rexySkinGrad)"
        />
        {/* Tail Spike */}
        <path d="M22 98L16 92L24 93Z" fill="#FBBF24" />

        {/* Dragon Horns / Crest */}
        <path d="M56 34L48 18C47 16 51 14 54 16L64 30Z" fill="#F59E0B" />
        <path d="M104 34L112 18C113 16 109 14 106 16L96 30Z" fill="#F59E0B" />
        <path d="M80 22L83 12C83 10 77 10 77 12L80 22Z" fill="#FBBF24" />

        {/* Body */}
        <ellipse cx="80" cy="105" rx="40" ry="34" fill="url(#rexySkinGrad)" />
        {/* Soft Underbelly */}
        <ellipse cx="80" cy="110" rx="24" ry="24" fill="url(#rexyBellyGrad)" />

        {/* Dragon Wings */}
        <path
          d="M36 92C18 78 12 60 26 52C28 66 38 78 44 86Z"
          fill="#0284C7"
          opacity="0.9"
        />
        <path
          d="M124 92C142 78 148 60 134 52C132 66 122 78 116 86Z"
          fill="#0284C7"
          opacity="0.9"
        />

        {/* Head */}
        <ellipse cx="80" cy="62" rx="38" ry="32" fill="url(#rexySkinGrad)" />

        {/* Rosy Cheeks */}
        <ellipse cx="54" cy="74" rx="7" ry="4" fill="#F472B6" opacity="0.6" />
        <ellipse cx="106" cy="74" rx="7" ry="4" fill="#F472B6" opacity="0.6" />

        {/* Expressive Big Eyes (Anime/Disney Explorer Style) */}
        {/* Left Eye */}
        <ellipse cx="62" cy="60" rx="9" ry="12" fill="#0F172A" />
        {/* Right Eye */}
        <ellipse cx="98" cy="60" rx="9" ry="12" fill="#0F172A" />

        {/* Eye Irises */}
        <ellipse cx="63" cy="61" rx="7" ry="9" fill="#0284C7" />
        <ellipse cx="97" cy="61" rx="7" ry="9" fill="#0284C7" />

        {/* Eye Pupils */}
        <circle cx="64" cy="61" r="5" fill="#090D16" />
        <circle cx="96" cy="61" r="5" fill="#090D16" />

        {/* Big Catchlight Reflections */}
        <circle cx="61" cy="56" r="3.5" fill="#FFFFFF" />
        <circle cx="66" cy="63" r="1.5" fill="#BAE6FD" />
        <circle cx="95" cy="56" r="3.5" fill="#FFFFFF" />
        <circle cx="100" cy="63" r="1.5" fill="#BAE6FD" />

        {/* Cute Snout & Cheerful Smile */}
        <ellipse cx="80" cy="76" rx="14" ry="9" fill="#38BDF8" opacity="0.4" />
        <circle cx="76" cy="73" r="1.2" fill="#0369A1" />
        <circle cx="84" cy="73" r="1.2" fill="#0369A1" />
        {mood === 'speaking' ? (
          <path
            d="M72 76Q80 88 88 76Q80 84 72 76Z"
            fill="#E11D48"
            stroke="#0F172A"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        ) : (
          <path
            d="M73 76Q80 83 87 76"
            stroke="#0F172A"
            strokeWidth="2.4"
            strokeLinecap="round"
            fill="none"
          />
        )}

        {/* Front Paws / Hands */}
        {variant === 'reading' ? (
          /* Paws holding magical open glowing book */
          <g>
            <path d="M50 115L80 125L110 115L110 135L80 145L50 135Z" fill="url(#bookCover)" />
            <path d="M53 116L80 124L80 142L53 133Z" fill="#F8FAFC" />
            <path d="M80 124L107 116L107 133L80 142Z" fill="#F1F5F9" />
            {/* Book Glow Sparks */}
            <circle cx="80" cy="120" r="3" fill="#FACC15" />
            <circle cx="70" cy="116" r="2" fill="#38BDF8" />
            <circle cx="90" cy="116" r="2" fill="#F472B6" />
            {/* Paws on sides of book */}
            <ellipse cx="50" cy="122" rx="6" ry="5" fill="#38BDF8" />
            <ellipse cx="110" cy="122" rx="6" ry="5" fill="#38BDF8" />
          </g>
        ) : variant === 'blocks' ? (
          /* Paws playing with colorful number blocks */
          <g>
            <rect x="52" y="116" width="16" height="16" rx="3" fill="#3B82F6" />
            <text x="60" y="129" fill="white" fontSize="11" fontWeight="bold" textAnchor="middle">1</text>
            <rect x="72" y="112" width="16" height="16" rx="3" fill="#EC4899" />
            <text x="80" y="125" fill="white" fontSize="11" fontWeight="bold" textAnchor="middle">+</text>
            <rect x="92" y="116" width="16" height="16" rx="3" fill="#10B981" />
            <text x="100" y="129" fill="white" fontSize="11" fontWeight="bold" textAnchor="middle">2</text>
            <ellipse cx="50" cy="120" rx="5" ry="4" fill="#38BDF8" />
            <ellipse cx="110" cy="120" rx="5" ry="4" fill="#38BDF8" />
          </g>
        ) : variant === 'science' ? (
          /* Magnifying Glass & Butterfly */
          <g>
            {/* Magnifying Glass */}
            <circle cx="64" cy="116" r="10" stroke="#0F172A" strokeWidth="2.5" fill="#E0F2FE" fillOpacity="0.7" />
            <line x1="58" y1="124" x2="48" y2="136" stroke="#D97706" strokeWidth="4" strokeLinecap="round" />
            {/* Butterfly */}
            <path d="M102 110C98 104 94 108 98 114C94 120 98 124 102 118Z" fill="#F43F5E" />
            <path d="M104 110C108 104 112 108 108 114C112 120 108 124 104 118Z" fill="#F59E0B" />
            <ellipse cx="62" cy="124" rx="5" ry="4" fill="#38BDF8" />
            <ellipse cx="98" cy="124" rx="5" ry="4" fill="#38BDF8" />
          </g>
        ) : (
          /* Normal cute paws */
          <g>
            <ellipse cx="60" cy="118" rx="9" ry="7" fill="#38BDF8" />
            <ellipse cx="100" cy="118" rx="9" ry="7" fill="#38BDF8" />
            {/* Little Claws */}
            <circle cx="56" cy="121" r="1.5" fill="#FFFFFF" />
            <circle cx="60" cy="122" r="1.5" fill="#FFFFFF" />
            <circle cx="64" cy="121" r="1.5" fill="#FFFFFF" />
            <circle cx="96" cy="121" r="1.5" fill="#FFFFFF" />
            <circle cx="100" cy="122" r="1.5" fill="#FFFFFF" />
            <circle cx="104" cy="121" r="1.5" fill="#FFFFFF" />
          </g>
        )}

        {/* High-Tech Explorer Headphones */}
        {/* Headband Arc */}
        <path
          d="M38 60C38 32 54 22 80 22C106 22 122 32 122 60"
          stroke="url(#headphoneArc)"
          strokeWidth="7"
          strokeLinecap="round"
        />
        {/* Left Ear Cup */}
        <g>
          <rect x="30" y="48" width="14" height="26" rx="7" fill="url(#earCupGrad)" stroke="#0F172A" strokeWidth="2.5" />
          <ellipse cx="37" cy="61" rx="4" ry="8" fill="url(#glowEar)" />
          {/* Headphone light ring */}
          <circle cx="37" cy="61" r="2.5" fill="#FFFFFF" />
        </g>

        {/* Right Ear Cup */}
        <g>
          <rect x="116" y="48" width="14" height="26" rx="7" fill="url(#earCupGrad)" stroke="#0F172A" strokeWidth="2.5" />
          <ellipse cx="123" cy="61" rx="4" ry="8" fill="url(#glowEar)" />
          {/* Headphone light ring */}
          <circle cx="123" cy="61" r="2.5" fill="#FFFFFF" />
        </g>

        {/* Microphone Boom & Glowing Tip */}
        <path
          d="M40 68Q48 84 66 82"
          stroke="#0F172A"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="67" cy="82" r="4" fill="#00E5FF" stroke="#0F172A" strokeWidth="1.5" />
        {mood === 'speaking' && (
          <circle cx="67" cy="82" r="6" fill="#00E5FF" opacity="0.4" />
        )}

        {/* Sparkle star on right headphone */}
        <path
          d="M118 24L120 17L122 24L129 26L122 28L120 35L118 28L111 26Z"
          fill="#FDE047"
        />
      </svg>
    </div>
  );
};

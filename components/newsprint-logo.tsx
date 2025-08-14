import * as React from "react";

type Props = {
  size?: number;
  className?: string;
  title?: string;
};

/**
 * Newsprint-style circular monogram logo for "SANGSEOK LOG"
 * - Monochrome, works with the current newspaper theme variables
 * - Uses currentColor for strokes; inherits text color
 */
export function NewsprintLogo({
  size = 32,
  className,
  title = "SANGSEOK LOG",
}: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label={title}
      className={className}
    >
      <defs>
        {/* Subtle paper grain via pattern (very light) */}
        <pattern id="grain" patternUnits="userSpaceOnUse" width="6" height="6">
          <rect width="6" height="6" fill="var(--paper-tint)" />
          <circle cx="1" cy="1" r="0.4" fill="rgba(0,0,0,0.06)" />
          <circle cx="5" cy="2" r="0.3" fill="rgba(0,0,0,0.06)" />
          <circle cx="3" cy="5" r="0.35" fill="rgba(0,0,0,0.06)" />
        </pattern>
      </defs>

      {/* Outer ring */}
      <circle
        cx="32"
        cy="32"
        r="30"
        fill="url(#grain)"
        stroke="currentColor"
        strokeWidth="2"
      />

      {/* Inner ring */}
      <circle
        cx="32"
        cy="32"
        r="24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.7"
      />

      {/* Newspaper stripes */}
      <line
        x1="14"
        y1="24"
        x2="50"
        y2="24"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.35"
      />
      <line
        x1="14"
        y1="40"
        x2="50"
        y2="40"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.35"
      />

      {/* Monogram 'SL' */}
      <g fill="currentColor">
        {/* Stylized S */}
        <path
          d="M27 21c-4 0-7 2.2-7 5 0 2.5 2 3.7 5.8 4.5l2.4.5c2.5.5 3.7 1.1 3.7 2.5 0 1.7-2 2.8-4.7 2.8-2.4 0-4.6-.7-6.4-2l-2 3.2c2.3 1.6 5.2 2.5 8.4 2.5 5.2 0 9-2.6 9-6.4 0-3-2.1-4.7-6.4-5.6l-2.2-.5c-2.6-.6-3.5-1.1-3.5-2.3 0-1.4 1.7-2.3 4.1-2.3 2 0 4 .6 5.6 1.7l1.8-3.1C33.7 21.7 30.6 21 27 21z"
          opacity="0.95"
        />
        {/* Stylized L */}
        <path d="M38 22h4v17h9v3.5H38V22z" opacity="0.95" />
      </g>
    </svg>
  );
}

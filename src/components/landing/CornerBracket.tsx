/**
 * AUI-style decorative corner bracket SVG.
 * Renders an L-shaped bracket mark used at corners of feature cards and sections.
 */
export type CornerPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

interface CornerBracketProps {
  position: CornerPosition;
  variant?: 'dark' | 'light';
  size?: number;
  className?: string;
}

const rotationMap: Record<CornerPosition, string> = {
  'top-left': 'rotate-0',
  'top-right': 'rotate-90',
  'bottom-left': '-rotate-90',
  'bottom-right': 'rotate-180',
};

export default function CornerBracket({
  position,
  variant = 'dark',
  size = 20,
  className = '',
}: CornerBracketProps) {
  const strokeColor = variant === 'dark' ? '#F1F0E0' : '#121212';
  const strokeOpacity = variant === 'dark' ? '0.3' : '0.2';

  return (
    <div className={`h-5 w-5 ${rotationMap[position]} ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1 1V19"
          stroke={strokeColor}
          strokeOpacity={strokeOpacity}
          strokeWidth="1.5"
        />
        <path
          d="M1 1H19"
          stroke={strokeColor}
          strokeOpacity={strokeOpacity}
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}

/**
 * Renders all four corner brackets around a container.
 * Use this inside a relative-positioned parent.
 */
export function CornerBrackets({
  variant = 'dark',
}: {
  variant?: 'dark' | 'light';
}) {
  return (
    <>
      <div className="flex w-full justify-between">
        <CornerBracket position="top-left" variant={variant} />
        <CornerBracket position="top-right" variant={variant} />
      </div>
    </>
  );
}

export function CornerBracketsBottom({
  variant = 'dark',
}: {
  variant?: 'dark' | 'light';
}) {
  return (
    <div className="flex w-full justify-between">
      <CornerBracket position="bottom-left" variant={variant} />
      <CornerBracket position="bottom-right" variant={variant} />
    </div>
  );
}

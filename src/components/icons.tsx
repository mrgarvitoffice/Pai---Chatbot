import type { SVGProps } from 'react';

export function PaiLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      fill="currentColor"
      {...props}
    >
      <g stroke="none" strokeWidth="1" fillRule="evenodd">
        {/* Teal base */}
        <path
          d="M55.9,19.2 C55.9,23.3 39,26.4 19.4,26.4 C-0.2,26.4 -3.1,23.3 6.5,19.2 C16.1,15.1 36.3,15.1 55.9,19.2 Z"
          fill="#1B8B77"
        ></path>
        {/* Purple top */}
        <ellipse
          fill="#BCA8E8"
          cx="32.5"
          cy="18.5"
          rx="25.5"
          ry="7.5"
        ></ellipse>
        {/* Legs */}
        <path
          d="M17.7,25.9 C17.7,25.9 15.2,45.2 21,49.9 C26.8,54.6 29.3,25.9 29.3,25.9 L17.7,25.9 Z"
          fill="#BCA8E8"
        ></path>
        <path
          d="M21,25.9 C21,25.9 18.5,45.2 24.3,49.9 C30.1,54.6 32.6,25.9 32.6,25.9 L21,25.9 Z"
          fill="#1B8B77"
        ></path>
        <path
          d="M35.4,25.9 C35.4,25.9 32.9,45.2 38.7,49.9 C44.5,54.6 47,25.9 47,25.9 L35.4,25.9 Z"
          fill="#BCA8E8"
        ></path>
        <path
          d="M38.7,25.9 C38.7,25.9 36.2,45.2 42,49.9 C47.8,54.6 50.3,25.9 50.3,25.9 L38.7,25.9 Z"
          fill="#1B8B77"
        ></path>
      </g>
    </svg>
  );
}

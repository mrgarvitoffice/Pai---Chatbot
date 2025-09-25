import type { SVGProps } from 'react';

export function PaiLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
        opacity="0.1"
      />
      <path
        d="M12 4c-4.41 0-8 3.59-8 8s3.59 8 8 8 8-3.59 8-8-3.59-8-8-8zm-1.71 12.71L6 12.41l1.41-1.41 2.88 2.88 5.29-5.29L17 10l-6.71 6.71z"
        fill="hsl(var(--primary))"
      />
    </svg>
  );
}

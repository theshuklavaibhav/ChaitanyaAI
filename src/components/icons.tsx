import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2c-2.4 0-4.7.9-6.5 2.5C2.9 6.3 2 8.9 2 11.5c0 3.3 1.8 6.3 4.5 8.1" />
      <path d="M12 2c2.4 0 4.7.9 6.5 2.5 2.6 1.8 3.5 4.4 3.5 7 0 3.3-1.8 6.3-4.5 8.1" />
      <path d="M5.5 19.6c.2.1.4.2.6.3 1.6 1 3.5 1.6 5.4 1.6s3.8-.6 5.4-1.6c.2-.1.4-.2.6-.3" />
      <path d="M12 14c-2 0-3.5-1.5-3.5-3.5S10 7 12 7s3.5 1.5 3.5 3.5-1.5 3.5-3.5 3.5z" />
      <path d="M2 11.5c0-1.2.3-2.4.8-3.5" />
      <path d="M22 11.5c0-1.2-.3-2.4-.8-3.5" />
    </svg>
  );
}

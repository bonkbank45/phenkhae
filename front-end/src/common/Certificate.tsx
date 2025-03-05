import { SVGProps } from 'react';

export default function Certificate(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width="1em"
      height="1em"
      {...props}
    >
      <g fill="none" stroke="currentColor" strokeWidth="4">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M26 36H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h36a2 2 0 0 1 2 2v26a2 2 0 0 1-2 2h-8M12 14h24m-24 7h6m-6 7h4"
        ></path>
        <path d="M30 33a6 6 0 1 0 0-12a6 6 0 0 0 0 12Z"></path>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m30 40l4 2V31.472S32.86 33 30 33s-4-1.5-4-1.5V42z"
        ></path>
      </g>
    </svg>
  );
}

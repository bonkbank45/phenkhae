import { SVGProps } from 'react';

export function FileAdditionOne(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width="1em"
      height="1em"
      {...props}
    >
      <g
        fill="none"
        stroke={props.color || '#000'}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4"
      >
        <path d="M40 23V14L31 4H10C8.89543 4 8 4.89543 8 6V42C8 43.1046 8.89543 44 10 44H22"></path>
        <path d="M33 29V43"></path>
        <path d="M26 36H33H40"></path>
        <path d="M30 4V14H40"></path>
      </g>
    </svg>
  );
}

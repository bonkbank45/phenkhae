export default function IconFilter3Fill({
  width,
  height,
  className,
}: {
  width: number;
  height: number;
  className: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height={height}
      width={width}
      className={className}
    >
      <path fill="none" d="M0 0h24v24H0z" />
      <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" />
    </svg>
  );
}

// Set de iconos SVG en linea (estilo outline, heredan color via currentColor)
// para no depender de una libreria externa ni de emojis -- se ven iguales en
// cualquier sistema operativo y siempre en blanco/acento segun el contexto.
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 18, ...props }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    ...props,
  };
}

export function IconShop(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M6 8h12l1 12.5a1 1 0 0 1-1 1.5H6a1 1 0 0 1-1-1.5L6 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

export function IconHeart(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 20.5s-7.5-4.6-9.8-9.1C.6 7.9 2.3 4.6 5.6 4a5 5 0 0 1 6.4 2.3A5 5 0 0 1 18.4 4c3.3.6 5 3.9 3.4 7.4-2.3 4.5-9.8 9.1-9.8 9.1Z" />
    </svg>
  );
}

export function IconHeartFilled(props: IconProps) {
  return (
    <svg {...base(props)} fill="currentColor" stroke="none">
      <path d="M12 20.5s-7.5-4.6-9.8-9.1C.6 7.9 2.3 4.6 5.6 4a5 5 0 0 1 6.4 2.3A5 5 0 0 1 18.4 4c3.3.6 5 3.9 3.4 7.4-2.3 4.5-9.8 9.1-9.8 9.1Z" />
    </svg>
  );
}

export function IconChart(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 20V10" />
      <path d="M12 20V4" />
      <path d="M20 20v-7" />
      <path d="M2.5 20h19" />
    </svg>
  );
}

export function IconMenu(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3.5 6h17" />
      <path d="M3.5 12h17" />
      <path d="M3.5 18h17" />
    </svg>
  );
}

export function IconClose(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M6 6l12 12" />
      <path d="M18 6L6 18" />
    </svg>
  );
}

export function IconStar(props: IconProps) {
  return (
    <svg {...base(props)} fill="currentColor" stroke="none">
      <path d="M12 3.5l2.6 5.4 5.9.7-4.3 4.1 1.1 5.9L12 16.7l-5.3 2.9 1.1-5.9-4.3-4.1 5.9-.7L12 3.5Z" />
    </svg>
  );
}

export function IconCheckCircle(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.3l2.4 2.4 4.8-5.2" />
    </svg>
  );
}

export function IconAlertTriangle(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 4 21.5 20h-19L12 4Z" />
      <path d="M12 10.5v4" />
      <circle cx="12" cy="17.3" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconAlertCircle(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5.5" />
      <circle cx="12" cy="16.3" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconEye(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M2.5 12S5.8 5.5 12 5.5 21.5 12 21.5 12 18.2 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function IconEyeOff(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3 3l18 18" />
      <path d="M10.6 5.7A10.4 10.4 0 0 1 12 5.5c6.2 0 9.5 6.5 9.5 6.5a17 17 0 0 1-3.3 4.2" />
      <path d="M6.6 6.9C4 8.6 2.5 12 2.5 12S5.8 18.5 12 18.5c1.3 0 2.5-.3 3.5-.7" />
      <path d="M9.9 10a3 3 0 0 0 4.1 4.1" />
    </svg>
  );
}

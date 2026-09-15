import { useState, type InputHTMLAttributes } from "react";
import { IconEye, IconEyeOff } from "./Icons";

type PasswordInputProps = InputHTMLAttributes<HTMLInputElement>;

/// Input de contrasena con boton de mostrar/ocultar (icono de ojo), para no
/// tener que escribir la clase input-base + el toggle en cada formulario.
export function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        {...props}
        type={visible ? "text" : "password"}
        className={`${className ?? ""} pr-11`}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Ocultar contrasena" : "Mostrar contrasena"}
        aria-pressed={visible}
        tabIndex={-1}
        className="absolute right-0 top-0 flex h-full w-11 items-center justify-center"
        style={{ color: "var(--text-muted)" }}
      >
        {visible ? <IconEyeOff size={18} /> : <IconEye size={18} />}
      </button>
    </div>
  );
}

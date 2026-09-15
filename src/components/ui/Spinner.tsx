export function Spinner({ size = 22 }: { size?: number }) {
  return (
    <span
      className="inline-block animate-spin rounded-full border-2 border-t-transparent"
      style={{
        width: size,
        height: size,
        borderColor: "var(--accent)",
        borderTopColor: "transparent",
      }}
      role="status"
      aria-label="Cargando"
    />
  );
}

export function PageSpinner() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Spinner size={32} />
    </div>
  );
}

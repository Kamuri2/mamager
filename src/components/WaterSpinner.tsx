export function WaterSpinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div className="water-spinner" />
      <span className="text-sm font-semibold" style={{ color: 'hsl(213, 70%, 40%)' }}>
        Cargando...
      </span>
    </div>
  );
}

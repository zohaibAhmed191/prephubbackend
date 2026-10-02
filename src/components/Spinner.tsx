interface SpinnerProps {
  size?: number;
  thickness?: number;
  color?: string;
}

/** Small inline spinner. Drop anywhere you'd show "Loading..." text next to it. */
export function Spinner({ size = 18, thickness = 2.5, color }: SpinnerProps) {
  return (
    <span
      className="spinner"
      style={{
        width: size,
        height: size,
        borderWidth: thickness,
        ...(color ? { borderColor: `var(--border) var(--border) var(--border) ${color}` } : {}),
      }}
    />
  );
}

interface PageLoaderProps {
  label?: string;
  minHeight?: number | string;
}

/** Full-section centered spinner with an optional label, for whole-page/whole-panel loading states. */
export default function PageLoader({ label = 'Loading...', minHeight = '50vh' }: PageLoaderProps) {
  return (
    <div style={{ minHeight, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: '60px 20px' }}>
      <Spinner size={34} thickness={3} />
      {label && <p style={{ fontSize: 14, color: 'var(--muted)' }}>{label}</p>}
    </div>
  );
}

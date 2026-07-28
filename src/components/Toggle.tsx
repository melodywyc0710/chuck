interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  color?: string;
}

export default function Toggle({ checked, onChange, color = '#60a5fa' }: ToggleProps) {
  return (
    <label className="relative inline-block cursor-pointer select-none" style={{ fontSize: 17, width: '3.5em', height: '2em' }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        className="opacity-0 w-0 h-0 absolute"
      />
      <span
        className="absolute inset-0 rounded-full overflow-hidden transition-all duration-400"
        style={{
          background: checked ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.08)',
          boxShadow: checked ? `0 0 0 1px ${color}66` : '0 0 0 1px rgba(255,255,255,0.1)',
          transition: 'all 0.4s cubic-bezier(0.215, 0.610, 0.355, 1)',
        }}
      >
        {/* ON circle */}
        <span
          className="absolute rounded-full"
          style={{
            height: '1.4em', width: '1.4em',
            right: '0.3em', bottom: '0.3em',
            background: color,
            borderRadius: 'inherit',
            transform: checked ? 'translateX(0)' : 'translateX(150%)',
            transition: 'all 0.4s cubic-bezier(0.215, 0.610, 0.355, 1)',
          }}
        />
        {/* OFF circle */}
        <span
          className="absolute rounded-full"
          style={{
            height: '1.4em', width: '1.4em',
            left: '0.3em', bottom: '0.3em',
            background: 'rgba(255,255,255,0.25)',
            borderRadius: 'inherit',
            transform: checked ? 'translateX(-150%)' : 'translateX(0)',
            transition: 'all 0.4s cubic-bezier(0.215, 0.610, 0.355, 1)',
          }}
        />
      </span>
    </label>
  );
}

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  action: () => void;
}

interface Props {
  actions: QuickAction[];
}

export function QuickActions({ actions }: Props) {
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1">
      {actions.map((a) => (
        <button
          key={a.id}
          onClick={a.action}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-medium shrink-0 transition-all hover:scale-[1.02]"
          style={{
            backgroundColor: "var(--bg-surface)",
            border: "1px solid var(--border-default)",
            color: "var(--text-secondary)",
          }}
        >
          <span>{a.icon}</span>
          {a.label}
        </button>
      ))}
    </div>
  );
}

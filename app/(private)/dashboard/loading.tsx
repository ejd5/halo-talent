export default function DashboardLoading() {
  return (
    <div className="w-full space-y-8 animate-pulse">
      {/* Upper header summary card skeleton */}
      <div className="h-32 rounded-lg border border-[rgba(216,169,91,0.08)] bg-[var(--fumee,#15110D)] p-6 flex flex-col justify-between">
        <div className="h-4 w-1/4 bg-[rgba(244,238,227,0.1)] rounded" />
        <div className="h-8 w-1/3 bg-[rgba(216,169,91,0.15)] rounded" />
      </div>

      {/* Grid containing cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-48 rounded-lg border border-[rgba(216,169,91,0.08)] bg-[var(--fumee,#15110D)] p-6 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="h-4 w-1/2 bg-[rgba(244,238,227,0.1)] rounded" />
              <div className="h-3 w-3/4 bg-[rgba(244,238,227,0.06)] rounded" />
            </div>
            <div className="h-6 w-1/4 bg-[rgba(216,169,91,0.1)] rounded" />
          </div>
        ))}
      </div>

      {/* Table-like or list-like large card skeleton */}
      <div className="rounded-lg border border-[rgba(216,169,91,0.08)] bg-[var(--fumee,#15110D)] p-6 space-y-4">
        <div className="h-4 w-1/5 bg-[rgba(244,238,227,0.1)] rounded" />
        <hr className="border-[rgba(216,169,91,0.08)]" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex justify-between items-center py-2">
            <div className="space-y-2 w-1/3">
              <div className="h-3 w-full bg-[rgba(244,238,227,0.08)] rounded" />
              <div className="h-2.5 w-1/2 bg-[rgba(244,238,227,0.04)] rounded" />
            </div>
            <div className="h-6 w-16 bg-[rgba(216,169,91,0.1)] rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

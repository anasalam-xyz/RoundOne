// Shows while any dashboard page fetches data server-side
// Only covers the main content area sidebar and topbar stay visible

export default function DashboardLoading() {
  return (
    <div className="max-w-5xl mx-auto space-y-5 animate-pulse">

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {[0, 1].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-[#ede8fb] p-7">
            <div className="h-2.5 w-24 bg-[#f0ecfd] rounded-full mb-4" />
            <div className="h-14 w-20 bg-[#f0ecfd] rounded-xl mb-3" />
            <div className="h-2.5 w-32 bg-[#f7f5ff] rounded-full mb-4" />
            <div className="h-6 w-28 bg-[#f7f5ff] rounded-full" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl border border-[#ede8fb] p-6">
          <div className="h-2.5 w-20 bg-[#f0ecfd] rounded-full mb-6" />
          <div className="flex items-end gap-1.5 h-28">
            {[40, 60, 50, 75, 65, 80, 90].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-md bg-[#f0ecfd]"
                  style={{ height: `${h}%` }}
                />
                <div className="h-1.5 w-4 bg-[#f7f5ff] rounded-full" />
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-[#ede8fb] p-6">
          <div className="h-2.5 w-28 bg-[#f0ecfd] rounded-full mb-5" />
          <div className="space-y-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between py-1">
                <div className="space-y-1.5">
                  <div className="h-2.5 w-24 bg-[#f0ecfd] rounded-full" />
                  <div className="h-2 w-32 bg-[#f7f5ff] rounded-full" />
                </div>
                <div className="h-7 w-10 bg-[#f0ecfd] rounded-lg" />
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-[#ede8fb] p-6">
          <div className="h-2.5 w-20 bg-[#f0ecfd] rounded-full mb-5" />
          <div className="h-2 w-16 bg-[#f0ecfd] rounded-full mb-3" />
          <div className="space-y-2.5 mb-5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#f0ecfd] flex-shrink-0" />
                <div className="h-2 bg-[#f7f5ff] rounded-full" style={{ width: `${60 + i * 15}%` }} />
              </div>
            ))}
          </div>
          <div className="h-px bg-[#f0ecfd] mb-4" />
          <div className="h-2 w-16 bg-[#f0ecfd] rounded-full mb-3" />
          <div className="space-y-2.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#f0ecfd] flex-shrink-0" />
                <div className="h-2 bg-[#f7f5ff] rounded-full" style={{ width: `${70 - i * 10}%` }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <div className="skeleton h-5 rounded-lg w-3/4" />
          <div className="skeleton h-4 rounded-lg w-1/2" />
        </div>
        <div className="skeleton w-12 h-12 rounded-2xl ml-4" />
      </div>
      <div className="skeleton h-4 rounded-lg w-full" />
      <div className="flex gap-2">
        <div className="skeleton h-7 rounded-full w-20" />
        <div className="skeleton h-7 rounded-full w-24" />
      </div>
      <div className="skeleton h-10 rounded-2xl w-full" />
    </div>
  );
}

export function SkeletonDoctorCard() {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
      <div className="flex items-center gap-4">
        <div className="skeleton w-14 h-14 rounded-2xl" />
        <div className="space-y-2 flex-1">
          <div className="skeleton h-5 rounded-lg w-2/3" />
          <div className="skeleton h-4 rounded-lg w-1/2" />
        </div>
      </div>
      <div className="skeleton h-14 rounded-2xl w-full" />
      <div className="skeleton h-10 rounded-2xl w-full" />
    </div>
  );
}

export function SkeletonStat() {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-3">
      <div className="skeleton w-10 h-10 rounded-2xl" />
      <div className="skeleton h-8 rounded-lg w-16" />
      <div className="skeleton h-4 rounded-lg w-24" />
    </div>
  );
}

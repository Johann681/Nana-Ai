'use client';

interface HeaderProps {
  isOnline: boolean;
}

export default function Header({ isOnline }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 sm:px-6 py-4 bg-[#F9F8F6]/80 backdrop-blur-md border-b border-black/5 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-xl shadow-sm border border-emerald-200">
          👩‍⚕️
        </div>
        <div>
          <h1 className="text-base font-bold text-slate-900 leading-tight">
            Dr. Ada
          </h1>
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-slate-300'}`} />
            <p className="text-[10px] text-slate-500 font-medium">
              {isOnline ? 'Always available' : 'Thinking...'}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 py-1 border border-slate-200 rounded-md">
          Private
        </span>
      </div>
    </header>
  );
}

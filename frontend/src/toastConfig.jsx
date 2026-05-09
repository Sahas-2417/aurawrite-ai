import toast from 'react-hot-toast';
import { Check, X, Copy, Sparkles, Trash2, Zap, AlertTriangle, Info } from 'lucide-react';

// ─── Shared container style ────────────────────────────────────────────────
const base = `
  flex items-start gap-3
  px-4 py-3.5
  rounded-2xl
  border
  shadow-[0_8px_32px_rgba(0,0,0,0.35)]
  backdrop-blur-xl
  font-sans
  text-[13.5px] font-semibold
  leading-snug
  min-w-[260px] max-w-[340px]
  relative overflow-hidden
`.replace(/\n\s+/g, ' ').trim();

// ─── Accent bar on the left ────────────────────────────────────────────────
const AccentBar = ({ color }) => (
  <div
    className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
    style={{ background: color }}
  />
);

// ─── Icon wrapper ──────────────────────────────────────────────────────────
const IconBox = ({ children, bg, shadow }) => (
  <div
    className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center mt-0.5"
    style={{ background: bg, boxShadow: shadow }}
  >
    {children}
  </div>
);

// ─── Toast bodies ──────────────────────────────────────────────────────────

/** ✅ Success — purple glow */
const SuccessToast = ({ message, sub }) => (
  <div
    className={base}
    style={{
      background: 'rgba(15, 10, 30, 0.88)',
      border: '1px solid rgba(168, 85, 247, 0.25)',
    }}
  >
    <AccentBar color="linear-gradient(180deg, #a855f7, #6366f1)" />
    <div className="pl-2">
      <IconBox
        bg="rgba(168,85,247,0.18)"
        shadow="0 0 12px rgba(168,85,247,0.4)"
      >
        <Check className="w-4 h-4 text-purple-400" strokeWidth={2.5} />
      </IconBox>
    </div>
    <div className="flex flex-col gap-0.5 min-w-0">
      <span className="text-white text-[13.5px] font-semibold">{message}</span>
      {sub && <span className="text-slate-400 text-[11.5px] font-medium">{sub}</span>}
    </div>
  </div>
);

/** ❌ Error — red glow */
const ErrorToast = ({ message, sub }) => (
  <div
    className={base}
    style={{
      background: 'rgba(15, 8, 8, 0.90)',
      border: '1px solid rgba(239, 68, 68, 0.25)',
    }}
  >
    <AccentBar color="linear-gradient(180deg, #ef4444, #dc2626)" />
    <div className="pl-2">
      <IconBox
        bg="rgba(239,68,68,0.15)"
        shadow="0 0 12px rgba(239,68,68,0.35)"
      >
        <AlertTriangle className="w-4 h-4 text-red-400" strokeWidth={2.5} />
      </IconBox>
    </div>
    <div className="flex flex-col gap-0.5 min-w-0">
      <span className="text-white text-[13.5px] font-semibold">{message}</span>
      {sub && <span className="text-red-300/70 text-[11.5px] font-medium">{sub}</span>}
    </div>
  </div>
);

/** 📋 Copy — indigo accent */
const CopyToast = ({ message }) => (
  <div
    className={base}
    style={{
      background: 'rgba(10, 12, 30, 0.88)',
      border: '1px solid rgba(99, 102, 241, 0.25)',
    }}
  >
    <AccentBar color="linear-gradient(180deg, #6366f1, #8b5cf6)" />
    <div className="pl-2">
      <IconBox
        bg="rgba(99,102,241,0.18)"
        shadow="0 0 12px rgba(99,102,241,0.4)"
      >
        <Copy className="w-3.5 h-3.5 text-indigo-400" strokeWidth={2.5} />
      </IconBox>
    </div>
    <div className="flex flex-col gap-0.5">
      <span className="text-white text-[13.5px] font-semibold">{message}</span>
      <span className="text-slate-400 text-[11.5px] font-medium">Ready to paste anywhere</span>
    </div>
  </div>
);

/** ⚡ Generated — sparkle purple */
const GeneratedToast = () => (
  <div
    className={base}
    style={{
      background: 'rgba(12, 8, 28, 0.92)',
      border: '1px solid rgba(168, 85, 247, 0.3)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(168,85,247,0.1)',
    }}
  >
    <AccentBar color="linear-gradient(180deg, #c084fc, #a855f7, #6366f1)" />
    <div className="pl-2">
      <IconBox
        bg="linear-gradient(135deg, rgba(168,85,247,0.3), rgba(99,102,241,0.2))"
        shadow="0 0 16px rgba(168,85,247,0.5)"
      >
        <Sparkles className="w-4 h-4 text-purple-300" strokeWidth={2} />
      </IconBox>
    </div>
    <div className="flex flex-col gap-0.5">
      <span className="text-white text-[13.5px] font-semibold">Post generated!</span>
      <span className="text-purple-300/70 text-[11.5px] font-medium">Saved to My Posts automatically</span>
    </div>
  </div>
);

/** 🗑️ Deleted — slate accent */
const DeletedToast = ({ message }) => (
  <div
    className={base}
    style={{
      background: 'rgba(10, 12, 22, 0.88)',
      border: '1px solid rgba(100, 116, 139, 0.25)',
    }}
  >
    <AccentBar color="linear-gradient(180deg, #64748b, #475569)" />
    <div className="pl-2">
      <IconBox
        bg="rgba(100,116,139,0.15)"
        shadow="0 0 10px rgba(100,116,139,0.25)"
      >
        <Trash2 className="w-3.5 h-3.5 text-slate-400" strokeWidth={2.5} />
      </IconBox>
    </div>
    <div className="flex flex-col gap-0.5">
      <span className="text-slate-200 text-[13.5px] font-semibold">{message}</span>
    </div>
  </div>
);

/** ✨ Enhanced — indigo/blue accent */
const EnhancedToast = () => (
  <div
    className={base}
    style={{
      background: 'rgba(8, 10, 28, 0.92)',
      border: '1px solid rgba(99, 102, 241, 0.3)',
    }}
  >
    <AccentBar color="linear-gradient(180deg, #818cf8, #6366f1, #4f46e5)" />
    <div className="pl-2">
      <IconBox
        bg="linear-gradient(135deg, rgba(99,102,241,0.25), rgba(79,70,229,0.15))"
        shadow="0 0 14px rgba(99,102,241,0.45)"
      >
        <Zap className="w-4 h-4 text-indigo-300" strokeWidth={2} />
      </IconBox>
    </div>
    <div className="flex flex-col gap-0.5">
      <span className="text-white text-[13.5px] font-semibold">Post enhanced!</span>
      <span className="text-indigo-300/70 text-[11.5px] font-medium">Saved to your library</span>
    </div>
  </div>
);

/** 💡 Ideas — amber accent */
const IdeasToast = () => (
  <div
    className={base}
    style={{
      background: 'rgba(14, 10, 6, 0.90)',
      border: '1px solid rgba(245, 158, 11, 0.25)',
    }}
  >
    <AccentBar color="linear-gradient(180deg, #f59e0b, #d97706)" />
    <div className="pl-2">
      <IconBox
        bg="rgba(245,158,11,0.15)"
        shadow="0 0 12px rgba(245,158,11,0.35)"
      >
        <Sparkles className="w-4 h-4 text-amber-400" strokeWidth={2} />
      </IconBox>
    </div>
    <div className="flex flex-col gap-0.5">
      <span className="text-white text-[13.5px] font-semibold">Ideas generated!</span>
      <span className="text-amber-300/70 text-[11.5px] font-medium">Fresh content inspiration ready</span>
    </div>
  </div>
);

// ─── Exported helper functions ─────────────────────────────────────────────

const opts = { duration: 3500 };

export const notify = {
  success: (msg, sub) =>
    toast.custom(<SuccessToast message={msg} sub={sub} />, opts),

  error: (msg, sub) =>
    toast.custom(<ErrorToast message={msg} sub={sub} />, opts),

  copy: (msg = 'Copied to clipboard!') =>
    toast.custom(<CopyToast message={msg} />, { duration: 2500 }),

  generated: () =>
    toast.custom(<GeneratedToast />, { duration: 4000 }),

  enhanced: () =>
    toast.custom(<EnhancedToast />, { duration: 3500 }),

  deleted: (msg = 'Post removed from history') =>
    toast.custom(<DeletedToast message={msg} />, { duration: 2500 }),

  ideas: () =>
    toast.custom(<IdeasToast />, { duration: 3500 }),
};

import React, { useState } from 'react';
import { ShieldAlert, ShieldCheck, KeyRound } from 'lucide-react';

export default function AdminAuth({ onAuthenticate }) {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passcode === 'admin123') {
      onAuthenticate(true);
      setError(false);
    } else {
      setError(true);
      setPasscode('');
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center p-3 sm:p-4 relative overflow-hidden select-none">

      {/* Background blobs (responsive scale) */}
      <div className="absolute top-1/4 left-1/4 w-52 sm:w-72 md:w-80 h-52 sm:h-72 md:h-80 rounded-full bg-brand-primary/10 blur-[100px] sm:blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-52 sm:w-72 md:w-80 h-52 sm:h-72 md:h-80 rounded-full bg-brand-accent/10 blur-[100px] sm:blur-[120px]" />

      <form
        onSubmit={handleSubmit}
        className="
          glass-panel
          w-full
          max-w-[90%]
          sm:max-w-sm
          md:max-w-md
          p-5 sm:p-6 md:p-8
          rounded-2xl
          space-y-5 sm:space-y-6
          shadow-2xl
          relative z-10
          text-center
        "
      >

        {/* ICON HEADER */}
        <div className="flex flex-col items-center gap-3">

          <div className="p-3 sm:p-4 rounded-full bg-brand-primary/15 border border-brand-primary/30 text-brand-primary shadow-lg shadow-brand-primary/10">

            {error ? (
              <ShieldAlert className="w-7 sm:w-9 md:w-10 h-7 sm:h-9 md:h-10 text-red-400 animate-bounce" />
            ) : (
              <ShieldCheck className="w-7 sm:w-9 md:w-10 h-7 sm:h-9 md:h-10 text-brand-accent" />
            )}

          </div>

          <h2 className="text-base sm:text-lg md:text-xl font-bold tracking-wider text-white uppercase mt-2">
            ADMIN STUDIO LOCK
          </h2>

          <p className="text-[10px] sm:text-xs text-brand-text/80 leading-relaxed max-w-[220px] sm:max-w-[260px]">
            Please enter your authorization code to access quotes and product price modifiers.
          </p>

        </div>

        {/* INPUT */}
        <div className="space-y-4">

          <div className="relative">

            <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text/50" />

            <input
              type="password"
              required
              value={passcode}
              onChange={(e) => {
                setPasscode(e.target.value);
                if (error) setError(false);
              }}
              placeholder="ENTER PASSCODE"
              className="
                w-full
                bg-brand-dark/50
                border border-brand-border/80
                hover:border-brand-border
                focus:border-brand-primary
                rounded-xl
                pl-10 pr-4
                py-2.5 sm:py-3
                text-[10px] sm:text-xs
                tracking-widest
                text-center
                text-white
                focus:outline-none
                transition-all
                font-mono
                uppercase
                placeholder:text-brand-text/30
              "
            />

          </div>

          {error && (
            <p className="text-[10px] text-red-400 font-extrabold uppercase tracking-wide">
              Invalid Authorization Code. Try Again.
            </p>
          )}

          <button
            type="submit"
            className="
              w-full
              glass-btn-primary
              py-2.5 sm:py-3
              rounded-xl
              text-[10px] sm:text-xs
              font-bold
              uppercase
              tracking-wider
              shadow
            "
          >
            Request Access
          </button>

        </div>

        {/* FOOTER */}
        <div className="pt-2 border-t border-brand-border/40 text-[8px] sm:text-[9px] text-brand-text/40 uppercase tracking-widest font-mono">
          Security Gate: active
        </div>

      </form>
    </div>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setIsLoading(true);
    setError(""); 

    try {
      const res = await fetch("http://127.0.0.1:3000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({username, email, password})
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to register");
      }

      router.push("/login");
      
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to process request");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-110 flex flex-col items-center">
      {/* Branding/Logo Area */}
      <div className="mb-xl text-center">
        <div className="flex items-center justify-center mb-md">
          <span className="material-symbols-outlined text-[48px] text-primary" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>blur_on</span>
        </div>
        <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">Zen Social</h1>
        <p className="font-body-sm text-body-sm text-secondary mt-xs">Minimalist Feed & Professional Networking</p>
      </div>

      {/* Register Card */}
      <div className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl p-lg md:p-xl transition-all duration-300">
        <header className="mb-lg">
          <h2 className="font-headline-md text-headline-md text-primary mb-xs">Create Identity</h2>
          <p className="font-body-sm text-body-sm text-secondary">Register your node in the Zen Social grid.</p>
        </header>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-lg">
          {/* Username Input */}
          <div className="space-y-xs">
            <label htmlFor="username" className="font-label-caps text-label-caps text-on-surface uppercase tracking-widest">Handle (Username)</label>
            <div className="relative flex items-center group">
              <span className="material-symbols-outlined absolute left-md text-secondary text-[20px] transition-colors group-focus-within:text-primary">tag</span>
              <input 
                id="username" 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full pl-11 pr-md py-md bg-surface-container-lowest border border-outline-variant rounded-lg font-body-sm text-body-sm transition-all focus:outline-none focus:border-primary focus:ring-0 text-primary placeholder-secondary" 
                placeholder="zen_architect" 
              />
            </div>
          </div>

          {/* Email Input */}
          <div className="space-y-xs">
            <label htmlFor="email" className="font-label-caps text-label-caps text-on-surface uppercase tracking-widest">Identifier (Email)</label>
            <div className="relative flex items-center group">
              <span className="material-symbols-outlined absolute left-md text-secondary text-[20px] transition-colors group-focus-within:text-primary">alternate_email</span>
              <input 
                id="email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-11 pr-md py-md bg-surface-container-lowest border border-outline-variant rounded-lg font-body-sm text-body-sm transition-all focus:outline-none focus:border-primary focus:ring-0 text-primary placeholder-secondary" 
                placeholder="name@domain.tech" 
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-xs">
            <label htmlFor="password" className="font-label-caps text-label-caps text-on-surface uppercase tracking-widest">Secret Key</label>
            <div className="relative flex items-center group">
              <span className="material-symbols-outlined absolute left-md text-secondary text-[20px] transition-colors group-focus-within:text-primary">lock</span>
              <input 
                id="password" 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-11 pr-md py-md bg-surface-container-lowest border border-outline-variant rounded-lg font-body-sm text-body-sm transition-all focus:outline-none focus:border-primary focus:ring-0 text-primary placeholder-secondary" 
                placeholder="••••••••" 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-md text-secondary hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">{showPassword ? "visibility_off" : "visibility"}</span>
              </button>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-md">
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-md bg-primary text-on-primary font-label-caps text-label-caps uppercase tracking-[0.15em] rounded-lg transition-all active:scale-[0.98] hover:opacity-90 disabled:opacity-50 disabled:active:scale-100 flex justify-center items-center h-13"
            >
              {isLoading ? <span className="material-symbols-outlined animate-spin">progress_activity</span> : "Provision Account"}
            </button>
          </div>
        </form>

        <div className="mt-lg pt-lg border-t border-outline-variant flex flex-col gap-md">
          <p className="font-body-sm text-body-sm text-secondary text-center">
            <span>Already indexed?</span>
            <Link href="/login" className="font-label-caps text-label-caps text-primary underline underline-offset-4 ml-xs hover:text-secondary transition-colors">Enter Hub</Link>
          </p>
        </div>
      </div>
      
      {/* Footer Decorative */}
      <footer className="mt-xl flex flex-col items-center gap-md">
        <div className="font-code text-code text-secondary opacity-40">V.2.0.4-STABLE // ENCRYPTED_AUTH_ACTIVE</div>
      </footer>
    </div>
  );
}
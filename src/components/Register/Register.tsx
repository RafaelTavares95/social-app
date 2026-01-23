import { useState, useMemo } from 'react';

interface RegisterProps {
    onSwitchToLogin: () => void;
}

export function Register({ onSwitchToLogin }: RegisterProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Cálculo derivado: a força é calculada sempre que o password muda
    // Usamos useMemo para evitar cálculos em re-renders não relacionados
    const strength = useMemo(() => {
        let score = 0;
        if (password.length === 0) return 0;
        if (password.length >= 8) score++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        return score;
    }, [password]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        // Simula uma chamada de API
        setTimeout(() => {
            setIsLoading(false);
            console.log('Register attempt:', { name, email, password });
        }, 1500);
    };

    const getStrengthColor = () => {
        switch (strength) {
            case 0: return 'bg-stone-500';
            case 1: return 'bg-red-500';
            case 2: return 'bg-orange-500';
            case 3: return 'bg-yellow-500';
            case 4: return 'bg-emerald-500';
            default: return 'bg-stone-500';
        }
    };

    const getStrengthText = () => {
        switch (strength) {
            case 0: return 'Too short';
            case 1: return 'Weak';
            case 2: return 'Fair';
            case 3: return 'Good';
            case 4: return 'Strong';
            default: return '';
        }
    };

    return (
        <div className="w-full max-w-md">
            {/* Glassmorphism Card */}
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-8 md:p-10 transform transition-all duration-300 hover:scale-[1.02]">
                {/* Logo/Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 via-emerald-600 to-emerald-800 rounded-2xl flex items-center justify-center shadow-lg transform transition-transform hover:rotate-12 duration-300">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                </div>

                {/* Title */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
                        Join Us
                    </h1>
                    <p className="text-stone-300/80 text-sm md:text-base">
                        Create your account to start
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name Input */}
                    <div className="group">
                        <label htmlFor="name" className="block text-sm font-medium text-stone-200 mb-1.5">
                            Full Name
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <svg className="w-5 h-5 text-emerald-400 group-focus-within:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-stone-300/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                                placeholder="John Doe"
                                required
                            />
                        </div>
                    </div>

                    {/* Email Input */}
                    <div className="group">
                        <label htmlFor="email" className="block text-sm font-medium text-stone-200 mb-1.5">
                            Email
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <svg className="w-5 h-5 text-emerald-400 group-focus-within:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                </svg>
                            </div>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-stone-300/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                                placeholder="your@email.com"
                                required
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="group">
                        <label htmlFor="password" className="block text-sm font-medium text-stone-200 mb-1.5">
                            Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <svg className="w-5 h-5 text-emerald-400 group-focus-within:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-stone-300/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        
                        {/* Password Strength Indicator */}
                        {password && (
                            <div className="mt-2">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold">Strength: {getStrengthText()}</span>
                                    <span className="text-[10px] text-stone-400">{password.length} chars</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden flex gap-1">
                                    {[1, 2, 3, 4].map((step) => (
                                        <div 
                                            key={step}
                                            className={`h-full flex-1 transition-all duration-500 ${
                                                strength >= step ? getStrengthColor() : 'bg-white/10'
                                            }`}
                                        />
                                    ))}
                                </div>
                                <p className="mt-1 text-[10px] text-stone-400/80">
                                    Use 8+ characters with letters, numbers & symbols
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 text-white font-semibold rounded-xl shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-emerald-500/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Creating Account...</span>
                            </>
                        ) : (
                            <span>Create Account</span>
                        )}
                    </button>
                </form>

                {/* Login Link */}
                <div className="mt-8 text-center">
                    <p className="text-stone-300 text-sm">
                        Already have an account?{' '}
                        <button 
                            onClick={onSwitchToLogin}
                            className="text-white font-semibold hover:text-stone-200 transition-colors bg-transparent border-none p-0 cursor-pointer"
                        >
                            Log In
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}

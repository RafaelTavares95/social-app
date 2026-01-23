export function Branding() {
    return (
        <div className="flex flex-col items-center justify-center h-full px-8">
            {/* Logo Icon */}
            <div className="mb-4 md:mb-8 relative">
                <div className="w-12 h-12 md:w-24 md:h-24 bg-gradient-to-br from-emerald-400 via-emerald-600 to-emerald-800 rounded-xl md:rounded-3xl flex items-center justify-center shadow-2xl transform transition-all duration-500 hover:scale-110 hover:rotate-6">
                    <svg className="w-6 h-6 md:w-12 md:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                </div>
            </div>

            {/* App Title */}
            <h1 className="text-3xl md:text-7xl lg:text-8xl font-bold text-white mb-2 md:mb-6 tracking-tight text-center">
                Social
                <span className="md:block bg-gradient-to-r from-stone-200 to-white bg-clip-text text-transparent ml-2 md:ml-0">
                    App
                </span>
            </h1>

            {/* Tagline - Hidden on Mobile to save space */}
            <p className="hidden md:block text-lg md:text-xl lg:text-2xl text-stone-200/80 text-center max-w-md mb-8 lg:mb-12 leading-relaxed">
                Connect with people around the world
            </p>
        </div>
    );
}

import { useState } from 'react'
import './App.css'
import { Login } from './components/Login/Login'
import { Register } from './components/Register/Register'
import { Branding } from './components/Branding/Branding'

function App() {
  const [currentView, setCurrentView] = useState<'login' | 'register'>('login');

  return (
    <div className="min-h-screen w-full bg-emerald-950 bg-gradient-to-br from-emerald-950 via-green-900/50 to-emerald-950 relative overflow-hidden flex items-center justify-center">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-500/10 rounded-full blur-[120px]"></div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-4 lg:gap-12 items-center">
        {/* Left Side: Branding (Smaller on mobile, full on desktop) */}
        <div className="flex items-center justify-center pt-4 lg:pt-0">
          <Branding />
        </div>

        {/* Right Side: Form Box */}
        <div className="flex justify-center lg:justify-start pb-8 lg:pb-0">
          {currentView === 'login' ? (
            <Login onSwitchToRegister={() => setCurrentView('register')} />
          ) : (
            <Register onSwitchToLogin={() => setCurrentView('login')} />
          )}
        </div>
      </div>
    </div>
  )
}

export default App

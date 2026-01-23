import './App.css'
import { Login } from './components/login/Login'
import { Branding } from './components/branding/branding'

function App() {
  return (
    <div className="min-h-screen w-full bg-emerald-950 bg-gradient-to-br from-emerald-950 via-green-900/50 to-emerald-950 relative overflow-hidden flex items-center justify-center">
      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-4 lg:gap-12 items-center">
        {/* Left Side: Branding (Smaller on mobile, full on desktop) */}
        <div className="flex items-center justify-center pt-4 lg:pt-0">
          <Branding />
        </div>

        {/* Right Side: Login Box */}
        <div className="flex justify-center lg:justify-start pb-8 lg:pb-0">
          <Login />
        </div>
      </div>
    </div>
  )
}

export default App

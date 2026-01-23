import { useLocation } from 'react-router-dom';

export function LoadingScreen() {
  const location = useLocation();
  const isAuthPath = location.pathname === '/login' || location.pathname === '/register';
  
  return (
    <div className={`min-h-screen w-full flex items-center justify-center ${
      isAuthPath 
        ? "bg-emerald-950 bg-gradient-to-br from-emerald-950 via-green-900/50 to-emerald-950" 
        : "bg-white"
    }`}>
      <div className="text-center">
        <div className={`w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4 ${
          isAuthPath ? "border-emerald-500/20 border-t-emerald-500" : "border-stone-200 border-t-emerald-500"
        }`}></div>
      </div>
    </div>
  );
}

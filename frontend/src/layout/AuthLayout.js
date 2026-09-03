import React from "react";
export function AuthLayout({ backgroundImage = "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=2220&auto=format&fit=crop", sloganText = "Gestão inteligente para você.", children }) {
    return (<div className="flex min-h-screen w-full bg-[#1A1A1A] font-sans">
      
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 text-white overflow-hidden bg-cover bg-center" style={{ backgroundImage: `linear-gradient(rgba(11, 37, 24, 0.7), rgba(11, 37, 24, 0.7)), url(${backgroundImage})` }}>
        {/* Brand/Logo Top Left */}
        <div className="relative z-20 flex items-center gap-2 text-2xl font-bold tracking-tight">
          <span className="text-white">Finance</span>
        </div>

        {/* Editable Slogan/Text */}
        <div className="relative z-20 max-w-lg mb-12">
          <h1 className="text-5xl md:text-6xl font-serif leading-tight font-medium text-[#F4F4F5]">
            {sloganText}
          </h1
        </div>
        
        {/* Bottom decorative bar */}
        <div className="relative z-20 h-1 w-24 bg-[#10B981] rounded-full"/>
      </div>

      {/* RIGHT SIDE: Dynamic Form Container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-white z-10">
        <div className="w-full max-w-md space-y-8">
          {children}
        </div>
      </div>
    </div>);
}

import React from 'react';
import { BrandConfig } from '../types';
import { Sparkles, Sliders, ShieldCheck, Tv, Smartphone, HelpCircle, Eye, EyeOff } from 'lucide-react';

interface HeaderBannerProps {
  brand: BrandConfig;
  isAdmin: boolean;
  isDevEnvironment?: boolean;
  previewAsClient?: boolean;
  onToggleClientPreview?: () => void;
  onOpenCustomizer: () => void;
  onOpenGuide: () => void;
}

export const HeaderBanner: React.FC<HeaderBannerProps> = ({
  brand,
  isAdmin,
  isDevEnvironment = false,
  previewAsClient = false,
  onToggleClientPreview,
  onOpenCustomizer,
  onOpenGuide,
}) => {
  return (
    <header className="relative w-full overflow-hidden border-b border-[#542126] bg-[#090707]">
      {/* Background radial glow */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background: `radial-gradient(circle at 50% 20%, ${brand.primaryColor}33 0%, rgba(10,5,6,0.95) 70%, #070707 100%)`,
        }}
      />

      {/* Grid subtle pattern */}
      <div 
        className="absolute inset-0 opacity-[0.07] pointer-events-none" 
        style={{
          backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Top utility bar */}
      <div className="relative z-10 border-b border-[#2b1014] bg-[#0c0809]/80 backdrop-blur-md px-4 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-[#bdb3b3]">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Servidores Online
            </span>
            <span className="hidden sm:inline text-neutral-500">•</span>
            <span className="hidden sm:inline">APKs 100% seguros, sem vírus e verificados</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Guide Button always available to users */}
            <button
              onClick={onOpenGuide}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#1d1214] hover:bg-[#2e171b] text-neutral-300 hover:text-white border border-[#4d1f25] transition cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-red-400" />
              <span>Como Instalar no TV Box</span>
            </button>

            {/* In AI Studio: preview client view toggle */}
            {isDevEnvironment && onToggleClientPreview && (
              <button
                onClick={onToggleClientPreview}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#181113] hover:bg-[#281519] text-neutral-300 hover:text-white border border-[#4a1c22] transition cursor-pointer text-[11px]"
                title={previewAsClient ? "Voltar ao Modo Editor" : "Simular visão final do cliente"}
              >
                {previewAsClient ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5 text-amber-400" />}
                <span>{previewAsClient ? "Modo Editor" : "Ver como Cliente"}</span>
              </button>
            )}

            {/* Customization Button: ONLY rendered for Admin in AI Studio! */}
            {isAdmin && (
              <button
                onClick={onOpenCustomizer}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-semibold shadow-md shadow-red-950/40 border border-red-400/40 transition cursor-pointer"
                title="Personalize sua Logo, Cores, WhatsApp e PIX (Invisível para o cliente no link final)"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Personalizar Minha Logo</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main hero brand area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-8 sm:pb-10 flex flex-col items-center text-center">
        {/* Banner Cover: Placed right above the tagline as requested */}
        {brand.bannerUrl ? (
          <div className="relative w-full max-w-[861px] mx-auto mb-6 group">
            {/* Ambient neon backlighting */}
            <div 
              className="absolute -inset-1.5 rounded-2xl opacity-60 blur-xl transition duration-500 group-hover:opacity-90"
              style={{
                background: 'linear-gradient(90deg, #ff142b 0%, #bd0018 35%, #0284c7 70%, #06b6d4 100%)',
              }}
            />
            {/* Image frame */}
            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-red-500/50 shadow-2xl shadow-red-950/80 bg-[#080506] flex justify-center">
              <img
                src={brand.bannerUrl}
                alt="ZARVIC PLAY - Central de Downloads"
                style={{ width: '861px' }}
                className="w-[861px] max-w-full h-auto object-cover max-h-[300px] sm:max-h-[380px] transition-transform duration-500 group-hover:scale-[1.01]"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        ) : (
          /* Fallback when no banner is loaded */
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-4">
            {brand.logoUrl && (brand.logoType === 'image' || brand.logoType === 'both') ? (
              <div className="relative group">
                <div 
                  className="absolute -inset-2 rounded-2xl opacity-60 blur-lg transition duration-500 group-hover:opacity-100"
                  style={{ backgroundColor: brand.primaryColor }}
                />
                <img
                  src={brand.logoUrl}
                  alt={`${brand.name} Logo`}
                  style={{ height: `${brand.logoHeight}px` }}
                  className="relative max-w-[280px] object-contain rounded-xl p-1 bg-black/40 border border-[#542126]"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : null}

            {(brand.logoType === 'text' || brand.logoType === 'both' || !brand.logoUrl) && (
              <h1 className="text-3xl sm:text-5xl font-black tracking-wider uppercase drop-shadow-md">
                <span className="text-white">{brand.name}</span>
                <span 
                  className="transition-colors duration-300"
                  style={{ color: brand.primaryColor }}
                >
                  {brand.nameHighlight}
                </span>
              </h1>
            )}
          </div>
        )}

        {/* Tagline: positioned directly below the banner cover */}
        <p className="max-w-3xl text-sm sm:text-base text-neutral-300 font-semibold mb-6 tracking-wide drop-shadow">
          {brand.tagline}
        </p>

        {/* Feature Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-neutral-300">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#181112] border border-[#542126]/80">
            <Tv className="w-3.5 h-3.5 text-red-400" />
            <span>Smart TV & TV Box</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#181112] border border-[#542126]/80">
            <Smartphone className="w-3.5 h-3.5 text-red-400" />
            <span>Celulares Android</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#181112] border border-[#542126]/80">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Links Diretos e Rápidos</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#181112] border border-[#542126]/80">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>100% Gratuito</span>
          </div>
        </div>

        {/* Announcement Notice */}
        {brand.announcementText && (
          <div className="mt-6 w-full max-w-3xl px-4 py-2.5 rounded-lg bg-gradient-to-r from-red-950/40 via-[#180d0f] to-red-950/40 border border-red-800/40 text-xs sm:text-sm text-red-200/90 text-center flex items-center justify-center gap-2">
            <span>{brand.announcementText}</span>
          </div>
        )}
      </div>
    </header>
  );
};

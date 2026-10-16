import React, { useState } from 'react';
import { AppItem } from '../types';
import { Download, QrCode, Tv, CheckCircle, ExternalLink, HardDrive } from 'lucide-react';

interface AppCardProps {
  app: AppItem;
  primaryColor?: string;
  onOpenQr: (app: AppItem) => void;
}

export const AppCard: React.FC<AppCardProps> = ({
  app,
  primaryColor = '#ff142b',
  onOpenQr,
}) => {
  const [imgError, setImgError] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Initials for fallback
  const initials = (app.name || 'APK')
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] || '')
    .join('')
    .toUpperCase();

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => setDownloading(false), 2000);
  };

  return (
    <article className="group relative flex flex-col justify-between rounded-xl border border-[#3e171c] bg-gradient-to-b from-[#140e10] to-[#0c090a] p-4 sm:p-5 shadow-lg shadow-black/60 transition-all duration-300 hover:-translate-y-1 hover:border-red-600/70 hover:shadow-red-950/30">
      {/* Top Section */}
      <div>
        <div className="flex items-start gap-3.5 mb-3">
          {/* App Icon */}
          <div className="relative flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-[#241014] border border-[#542126] flex items-center justify-center text-white font-bold text-lg shadow-inner">
            {app.icon && !imgError ? (
              <img
                src={app.icon}
                alt={app.name}
                loading="lazy"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <span className="text-red-400 font-mono tracking-widest text-lg font-bold">
                {initials}
              </span>
            )}

            {app.featured && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            )}
          </div>

          {/* Title & Metadata */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="text-base sm:text-lg font-bold text-white tracking-wide truncate group-hover:text-red-300 transition-colors">
                {app.name}
              </h3>
            </div>

            <div className="flex items-center gap-2 flex-wrap text-[11px]">
              <span className="px-2 py-0.5 rounded-md bg-[#2d1217] text-red-300 border border-[#6b2630] font-medium">
                {app.category || 'Aplicativo'}
              </span>
              <span className="text-neutral-400 font-mono">
                {app.version || 'APK'}
              </span>
              {app.size && (
                <span className="inline-flex items-center gap-1 text-neutral-400">
                  <HardDrive className="w-2.5 h-2.5" />
                  {app.size}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-[#bab1b1] line-clamp-3 leading-relaxed mb-3">
          {app.description || 'Aplicativo otimizado para dispositivos Android e TV Box.'}
        </p>

        {/* Compatibility & Downloader code */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-1.5 text-[11px] pt-2 border-t border-[#2d1217]">
          {app.compatibility ? (
            <span className="inline-flex items-center gap-1 text-neutral-400">
              <Tv className="w-3 h-3 text-red-400" />
              <span>{app.compatibility}</span>
            </span>
          ) : (
            <span className="text-neutral-500">Compatível com Android</span>
          )}

          {app.downloaderCode && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#1e1013] text-amber-300/90 border border-amber-600/30 font-mono text-[10px]">
              Downloader: <strong className="text-amber-300">{app.downloaderCode}</strong>
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-5 gap-2 pt-1">
        <a
          href={app.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleDownload}
          className="col-span-4 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg font-bold text-xs sm:text-sm text-white shadow-md transition-all duration-200 cursor-pointer active:scale-95"
          style={{
            background: `linear-gradient(100deg, ${primaryColor}, #990013)`,
            boxShadow: `0 4px 14px ${primaryColor}33`,
          }}
        >
          {downloading ? (
            <>
              <CheckCircle className="w-4 h-4 text-emerald-300 animate-bounce" />
              <span>Iniciando...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Baixar APK</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </>
          )}
        </a>

        <button
          type="button"
          onClick={() => onOpenQr(app)}
          title="Ver QR Code / Código TV Box"
          aria-label="Ver QR Code"
          className="col-span-1 flex items-center justify-center rounded-lg bg-[#201014] hover:bg-[#32171c] border border-[#5e222b] text-neutral-300 hover:text-white transition cursor-pointer"
        >
          <QrCode className="w-4 h-4" />
        </button>
      </div>
    </article>
  );
};

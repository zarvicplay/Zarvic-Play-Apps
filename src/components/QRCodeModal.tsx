import React, { useEffect, useState } from 'react';
import { AppItem } from '../types';
import { X, QrCode, Download, Copy, Check, Tv, Smartphone, ExternalLink } from 'lucide-react';
import QRCode from 'qrcode';

interface QRCodeModalProps {
  app: AppItem | null;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ app, onClose }) => {
  const [qrUrl, setQrUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    if (app?.url) {
      QRCode.toDataURL(
        app.url,
        {
          width: 280,
          margin: 1.5,
          color: {
            dark: '#000000',
            light: '#ffffff',
          },
        },
        (err, url) => {
          if (!err && url) {
            setQrUrl(url);
          }
        }
      );
    }
  }, [app]);

  if (!app) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(app.url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleCopyCode = async () => {
    if (!app.downloaderCode) return;
    try {
      await navigator.clipboard.writeText(app.downloaderCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    } catch {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-md rounded-2xl border border-[#71303a] bg-[#120a0c] p-6 shadow-2xl text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-[#251216] hover:bg-[#38181f] text-neutral-400 hover:text-white transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[#241014] border border-[#542126] overflow-hidden flex items-center justify-center flex-shrink-0">
            {app.icon ? (
              <img src={app.icon} alt={app.name} className="w-full h-full object-cover" />
            ) : (
              <QrCode className="w-6 h-6 text-red-400" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white leading-snug">{app.name}</h3>
            <span className="text-xs text-red-400 font-medium">Download direto & QR Code</span>
          </div>
        </div>

        {/* QR Code Canvas */}
        <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-dashed border-[#61242c] bg-[#080506] mb-4">
          {qrUrl ? (
            <img
              src={qrUrl}
              alt={`QR Code para baixar ${app.name}`}
              className="w-52 h-52 object-contain rounded-lg bg-white p-2 shadow-md"
            />
          ) : (
            <div className="w-52 h-52 flex items-center justify-center text-neutral-500">
              Gerando QR Code...
            </div>
          )}
          <p className="mt-2 text-xs text-neutral-400 text-center flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-red-400 inline" />
            Aponte a câmera do seu celular para baixar o APK
          </p>
        </div>

        {/* TV Box Downloader Code Option */}
        {app.downloaderCode && (
          <div className="mb-4 p-3 rounded-xl bg-[#1b1013] border border-amber-600/30 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Tv className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                  Código no App Downloader (TV Box)
                </span>
                <span className="text-lg font-mono font-black text-amber-300">
                  {app.downloaderCode}
                </span>
              </div>
            </div>

            <button
              onClick={handleCopyCode}
              className="px-2.5 py-1.5 rounded-lg bg-[#2b171c] hover:bg-[#3d1e25] text-amber-200 border border-amber-700/40 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copiado!' : 'Copiar'}</span>
            </button>
          </div>
        )}

        {/* URL Link and Download */}
        <div className="space-y-2">
          <button
            onClick={handleCopyLink}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#241115] hover:bg-[#34161c] border border-[#591e27] text-neutral-200 hover:text-white text-xs font-semibold transition cursor-pointer"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedLink ? 'Link direto copiado!' : 'Copiar Link Direto do APK'}</span>
          </button>

          <a
            href={app.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-red-950/60 transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Baixar Diretamente no Navegador</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>
        </div>
      </div>
    </div>
  );
};

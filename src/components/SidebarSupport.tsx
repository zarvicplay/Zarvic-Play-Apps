import React, { useState, useEffect, useRef } from 'react';
import { BrandConfig } from '../types';
import { Heart, Copy, Check, MessageCircle, ExternalLink, ShieldAlert, Sparkles, QrCode as QrIcon } from 'lucide-react';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import { generatePixBRCode } from '../utils/pix';

interface SidebarSupportProps {
  brand: BrandConfig;
  isAdmin?: boolean;
  onOpenCustomizer?: () => void;
}

export const SidebarSupport: React.FC<SidebarSupportProps> = ({ brand, isAdmin = false, onOpenCustomizer }) => {
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Generate PIX BR Code and QR Code whenever pixKey or receiver changes
  useEffect(() => {
    if (brand.pixQrImageUrl) {
      setQrDataUrl(brand.pixQrImageUrl);
      return;
    }

    const currentKey = brand.pixKey || 'zarvicplay@gmail.com';
    const receiverName = brand.pixReceiverName || 'ZARVIC PLAY';

    // Generate Bacen EMV PIX BR Code string
    const brCode = generatePixBRCode(currentKey, receiverName, 'BRASILIA');

    // Generate genuine high-res QR code data URL from official PIX BR Code payload
    QRCode.toDataURL(
      brCode,
      {
        width: 300,
        margin: 2,
        color: {
          dark: '#050304',
          light: '#ffffff',
        },
        errorCorrectionLevel: 'M',
      },
      (err, url) => {
        if (!err && url) {
          setQrDataUrl(url);
        }
      }
    );
  }, [brand.pixKey, brand.pixReceiverName, brand.pixQrImageUrl]);

  const handleCopyPix = async () => {
    try {
      await navigator.clipboard.writeText(brand.pixKey || 'zarvicplay@gmail.com');
      setCopied(true);

      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#ff142b', '#ffffff', '#25D366', '#ffd700'],
      });

      setTimeout(() => setCopied(false), 3000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  // WhatsApp target URL
  const waUrl = `https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(brand.whatsappMessage)}`;

  return (
    <aside className="w-full space-y-5" aria-label="Apoie e Contato">
      {/* Apoie o Projeto Panel */}
      <div className="relative rounded-2xl border border-[#71303a] bg-[#110a0b] p-5 text-center shadow-xl shadow-black/80">
        <div className="flex items-center justify-center gap-2 mb-2 text-[#f6f3f3]">
          <Heart className="w-5 h-5 text-red-500 fill-red-500 animate-pulse" />
          <h2 className="text-lg font-bold tracking-wide">Apoie o projeto</h2>
        </div>

        <p className="text-xs text-[#bdb3b3] leading-relaxed mb-3">
          {brand.pixDescription ||
            'Este site é totalmente gratuito. Se ele ajudou você, considere contribuir para manter o projeto no ar. Toda ajuda será bem-vinda!'}
        </p>


        {/* QR Code Container */}
        <div className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-dashed border-[#71303a] bg-[#090707] min-h-[180px] mb-3 relative group">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt={`QR Code PIX para ${brand.pixKey}`}
              className="w-48 h-48 max-w-full object-contain rounded-lg bg-white p-2 shadow-lg transition-transform group-hover:scale-102"
            />
          ) : (
            <canvas ref={qrCanvasRef} className="w-48 h-48 rounded-lg bg-white p-2" />
          )}
          <span className="text-[11px] text-cyan-300/90 mt-2 font-medium flex items-center gap-1">
            <QrIcon className="w-3.5 h-3.5" />
            Aponte a câmera do aplicativo do seu banco
          </span>
        </div>

        {/* PIX Key Box */}
        <div className="text-left mb-3">
          <span className="block text-[11px] text-[#bdb3b3] font-medium mb-1">
            PIX copia e cola
          </span>
          <code 
            id="pix-key"
            className="block p-2.5 rounded-lg border border-[#542126] bg-[#090707] text-[#fff] text-xs font-mono font-bold break-all select-all text-center tracking-wide"
          >
            {brand.pixKey || 'zarvicplay@gmail.com'}
          </code>
        </div>

        {/* Copy Button */}
        <button
          type="button"
          onClick={handleCopyPix}
          className="w-full flex items-center justify-center gap-2 min-h-[44px] px-4 rounded-xl border border-[#ff4656] text-white font-bold text-sm tracking-wide shadow-md transition-all duration-200 cursor-pointer active:scale-95"
          style={{
            background: 'linear-gradient(100deg, #ff142b, #bd0018)',
            boxShadow: '0 4px 15px rgba(255, 20, 43, 0.35)',
          }}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-200" />
              <span>CHAVE PIX COPIADA!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>▣ COPIA E COLA</span>
            </>
          )}
        </button>

        {copied && (
          <p className="mt-2 text-[11px] text-emerald-400 font-semibold animate-fade-in">
            ✓ Chave PIX copiada para a área de transferência!
          </p>
        )}
      </div>

      {/* WhatsApp Section */}
      <section className="rounded-2xl border border-[#3e1f24] bg-gradient-to-b from-[#181113] to-[#120d0f] p-5 shadow-xl shadow-black/80">
        <h2 className="text-base font-black tracking-wide text-white text-center leading-snug mb-2">
          ADQUIRA NOSSA LISTA <br />
          <span className="text-[#ff263c]">PELO WHATSAPP</span>
        </h2>

        <p className="text-xs text-[#bdb3b3] leading-relaxed text-center mb-4">
          Entre em contato pelo WhatsApp para adquirir nossa lista completa de canais, filmes e séries com suporte VIP.
        </p>

        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Adquirir lista pelo WhatsApp"
          className="group flex items-center justify-center gap-3 w-full min-h-[58px] p-3 rounded-xl bg-[#25D366] hover:bg-[#1fbd5b] text-white font-extrabold text-sm sm:text-base shadow-lg shadow-emerald-950/60 transition-all duration-200 cursor-pointer active:scale-95"
        >
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-inner">
            <svg
              className="w-6 h-6 fill-white text-white"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.23 8.23 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24M8.53 7.33c-.16 0-.36.06-.55.26-.19.2-.74.72-.74 1.76s.76 2.05.86 2.19c.1.14 1.46 2.29 3.59 3.18 1.76.74 2.12.59 2.5.56.38-.04 1.22-.5 1.39-.98.17-.49.17-.91.12-.99-.05-.09-.19-.14-.4-.25s-1.22-.6-1.41-.67c-.19-.07-.33-.1-.47.1-.14.2-.55.7-.67.84-.12.14-.24.16-.45.05-.21-.1-.89-.33-1.69-1.05-.62-.56-1.04-1.25-1.16-1.46-.12-.21-.01-.32.09-.43.1-.09.21-.24.32-.36.1-.12.14-.21.21-.35.07-.14.03-.26-.02-.37-.05-.1-.47-1.14-.65-1.56-.17-.41-.35-.35-.48-.36z" />
            </svg>
          </div>

          <div className="flex flex-col items-center sm:items-start text-left leading-tight">
            <span className="text-base tracking-wide font-black">{brand.whatsappDisplay}</span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-100 flex items-center gap-1">
              CLIQUE AQUI PARA CHAMAR <ExternalLink className="w-2.5 h-2.5 inline" />
            </span>
          </div>
        </a>
      </section>

      {/* Security & Attention Box */}
      <div className="rounded-xl border border-[#3e181d] bg-[#120b0d] p-4 text-xs text-[#b8adad] flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-white font-bold mb-1">Baixe com tranquilidade</h4>
          <p className="leading-relaxed">
            Todos os APKs são hospedados em canais oficiais e testados contra ameaças. Mantenha seu app sempre atualizado.
          </p>
        </div>
      </div>

      {/* Quick customizer callout - only for admin in AI Studio */}
      {isAdmin && onOpenCustomizer && (
        <div className="rounded-xl border border-dashed border-red-700/50 bg-[#170c0e] p-3 text-center">
          <p className="text-[11px] text-neutral-300 mb-2">
            Quer colocar <strong className="text-white">sua própria Logo</strong> e seu <strong className="text-emerald-400">WhatsApp</strong>?
          </p>
          <button
            onClick={onOpenCustomizer}
            className="w-full py-1.5 px-3 rounded-lg bg-[#2b1216] hover:bg-[#3d181f] text-red-300 hover:text-white border border-red-800/60 font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Editar Logo & Contatos</span>
          </button>
        </div>
      )}
    </aside>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { BrandConfig } from '../types';
import { Heart, Copy, Check, MessageCircle, ExternalLink, ShieldAlert, Sparkles, QrCode as QrIcon } from 'lucide-react';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import { generatePixBRCode } from '../utils/pix';

interface SidebarSupportProps {
  brand: BrandConfig;
  onOpenCustomizer?: () => void;
}

export const SidebarSupport: React.FC<SidebarSupportProps> = ({ brand, onOpenCustomizer }) => {
  const [copiedType, setCopiedType] = useState<'brcode' | 'key' | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [pixPayload, setPixPayload] = useState<string>('');
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Generate PIX BR Code and QR Code whenever pixKey or receiver changes
  useEffect(() => {
    if (brand.pixQrImageUrl) {
      setQrDataUrl(brand.pixQrImageUrl);
      setPixPayload(brand.pixKey);
      return;
    }

    const currentKey = brand.pixKey || 'zarvicplay@gmail.com';
    const receiverName = brand.pixReceiverName || 'ZARVIC PLAY';

    // Generate Bacen EMV PIX BR Code string
    const brCode = generatePixBRCode(currentKey, receiverName, 'BRASILIA');
    setPixPayload(brCode);

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

  const handleCopyPixBRCode = async () => {
    try {
      const codeToCopy = pixPayload || brand.pixKey;
      await navigator.clipboard.writeText(codeToCopy);
      setCopiedType('brcode');

      confetti({
        particleCount: 45,
        spread: 65,
        origin: { y: 0.7 },
        colors: ['#00b4d8', '#25D366', '#ff142b', '#ffffff'],
      });

      setTimeout(() => setCopiedType(null), 3000);
    } catch {
      setCopiedType('brcode');
      setTimeout(() => setCopiedType(null), 3000);
    }
  };

  const handleCopyEmailKey = async () => {
    try {
      await navigator.clipboard.writeText(brand.pixKey || 'zarvicplay@gmail.com');
      setCopiedType('key');
      setTimeout(() => setCopiedType(null), 3000);
    } catch {
      setCopiedType('key');
      setTimeout(() => setCopiedType(null), 3000);
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

        {/* Official PIX Badge */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/70 border border-cyan-800/60 text-cyan-300 text-[10px] font-bold uppercase tracking-wider mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span>PIX Oficial Banco Central</span>
        </div>

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
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] text-[#bdb3b3] font-medium">Chave PIX (E-mail)</span>
            <span className="text-[10px] text-cyan-400 font-semibold font-mono">
              {brand.pixReceiverName || 'ZARVIC PLAY'}
            </span>
          </div>
          <code 
            id="pix-key"
            className="block p-2.5 rounded-lg border border-[#542126] bg-[#090707] text-[#fff] text-xs font-mono font-bold break-all select-all text-center tracking-wide"
          >
            {brand.pixKey || 'zarvicplay@gmail.com'}
          </code>
        </div>

        {/* Copy Buttons */}
        <div className="space-y-2">
          {/* Main PIX Copia e Cola (BR Code) Button */}
          <button
            type="button"
            onClick={handleCopyPixBRCode}
            className="w-full flex items-center justify-center gap-2 min-h-[44px] px-4 rounded-xl border border-[#ff4656] text-white font-bold text-xs sm:text-sm tracking-wide shadow-md transition-all duration-200 cursor-pointer active:scale-95"
            style={{
              background: 'linear-gradient(100deg, #ff142b, #bd0018)',
              boxShadow: '0 4px 15px rgba(255, 20, 43, 0.35)',
            }}
          >
            {copiedType === 'brcode' ? (
              <>
                <Check className="w-4 h-4 text-emerald-200" />
                <span>PIX COPIA E COLA COPIADO!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>COPIAR PIX COPIA E COLA</span>
              </>
            )}
          </button>

          {/* Secondary Quick Copy E-mail Key Button */}
          <button
            type="button"
            onClick={handleCopyEmailKey}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#1c0f12] hover:bg-[#2c151a] text-neutral-300 hover:text-white border border-[#4d1f25] text-xs font-medium transition cursor-pointer"
          >
            {copiedType === 'key' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Chave de E-mail copiada!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-neutral-400" />
                <span>Copiar apenas a chave ({brand.pixKey || 'zarvicplay@gmail.com'})</span>
              </>
            )}
          </button>
        </div>

        {copiedType && (
          <p className="mt-2 text-[11px] text-emerald-400 font-semibold animate-fade-in">
            ✓ Pronto para colar no app do seu banco!
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
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
            <MessageCircle className="w-5 h-5 text-white fill-white" />
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

      {/* Quick customizer callout */}
      {onOpenCustomizer && (
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

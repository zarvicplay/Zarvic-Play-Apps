import React, { useState } from 'react';
import { X, Tv, Smartphone, ShieldCheck, CheckCircle2, ChevronRight, AlertTriangle } from 'lucide-react';

interface InstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallGuideModal: React.FC<InstallGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'tvbox' | 'android'>('tvbox');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl rounded-2xl border border-[#71303a] bg-[#120a0c] p-5 sm:p-7 shadow-2xl text-white my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Fechar tutorial"
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-[#251216] hover:bg-[#38181f] text-neutral-400 hover:text-white transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-950/80 text-red-400 border border-red-800/60 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            Guia Rápido de Instalação
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Como Instalar APK no seu Dispositivo
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Siga o passo a passo simplificado para instalar qualquer aplicativo sem erros.
          </p>
        </div>

        {/* Tab selection */}
        <div className="flex rounded-xl bg-[#080506] p-1 border border-[#3e181d] mb-6">
          <button
            onClick={() => setActiveTab('tvbox')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-bold text-xs sm:text-sm transition cursor-pointer ${
              activeTab === 'tvbox'
                ? 'bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Tv className="w-4 h-4" />
            <span>TV Box, Fire TV & Android TV</span>
          </button>

          <button
            onClick={() => setActiveTab('android')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-bold text-xs sm:text-sm transition cursor-pointer ${
              activeTab === 'android'
                ? 'bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Celular ou Tablet Android</span>
          </button>
        </div>

        {/* TV BOX Content */}
        {activeTab === 'tvbox' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-[#3e181d] bg-[#1a0f12]">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-red-600 text-white font-bold flex items-center justify-center text-sm">
                  1
                </span>
                <div>
                  <h4 className="font-bold text-white text-sm sm:text-base">
                    Instale o app "Downloader" na sua TV
                  </h4>
                  <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                    Na Google Play Store ou Amazon Appstore da sua TV, pesquise por <strong>Downloader</strong> (ícone laranja) e faça a instalação gratuita.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-[#3e181d] bg-[#1a0f12]">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-red-600 text-white font-bold flex items-center justify-center text-sm">
                  2
                </span>
                <div>
                  <h4 className="font-bold text-white text-sm sm:text-base">
                    Habilite "Fontes Desconhecidas" (Apenas 1ª vez)
                  </h4>
                  <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                    Vá em <strong>Configurações</strong> &gt; <strong>Preferências do Dispositivo</strong> &gt; <strong>Segurança e Restrições</strong> (ou <em>Opções do Desenvolvedor</em> no Fire Stick) e ative a permissão para o aplicativo <strong>Downloader</strong>.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-[#3e181d] bg-[#1a0f12]">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-red-600 text-white font-bold flex items-center justify-center text-sm">
                  3
                </span>
                <div>
                  <h4 className="font-bold text-white text-sm sm:text-base">
                    Digite o Código ou Link do Aplicativo
                  </h4>
                  <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                    Abra o app Downloader, clique na barra de URL e digite o código numérico ou o link direto do app disponível aqui no nosso catálogo.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-[#3e181d] bg-[#1a0f12]">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm">
                  ✓
                </span>
                <div>
                  <h4 className="font-bold text-white text-sm sm:text-base">
                    Clique em Instalar e Aproveite!
                  </h4>
                  <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                    Assim que o download terminar, o instalador abrirá automaticamente. Clique em <strong>Instalar</strong> e depois em <strong>Abrir</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ANDROID Content */}
        {activeTab === 'android' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-[#3e181d] bg-[#1a0f12]">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-red-600 text-white font-bold flex items-center justify-center text-sm">
                  1
                </span>
                <div>
                  <h4 className="font-bold text-white text-sm sm:text-base">
                    Clique em "Baixar APK"
                  </h4>
                  <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                    Escolha o aplicativo desejado em nosso catálogo e toque no botão <strong>Baixar APK</strong>.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-[#3e181d] bg-[#1a0f12]">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-red-600 text-white font-bold flex items-center justify-center text-sm">
                  2
                </span>
                <div>
                  <h4 className="font-bold text-white text-sm sm:text-base">
                    Permita o download do arquivo
                  </h4>
                  <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                    Se o navegador exibir a mensagem padrão de segurança <em>"O arquivo pode ser nocivo"</em>, toque em <strong>Fazer o download mesmo assim</strong>.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-[#3e181d] bg-[#1a0f12]">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-red-600 text-white font-bold flex items-center justify-center text-sm">
                  3
                </span>
                <div>
                  <h4 className="font-bold text-white text-sm sm:text-base">
                    Autorize fontes desconhecidas no navegador
                  </h4>
                  <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                    Ao abrir o arquivo baixado, se solicitado, vá em <strong>Configurações</strong> e marque a opção <em>"Permitir desta fonte"</em> para o Chrome ou navegador utilizado.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-[#3e181d] bg-[#1a0f12]">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm">
                  ✓
                </span>
                <div>
                  <h4 className="font-bold text-white text-sm sm:text-base">
                    Instalação concluída
                  </h4>
                  <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                    Toque em <strong>Instalar</strong>. Pronto! O aplicativo aparecerá na sua tela inicial pronto para uso.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notice alert */}
        <div className="mt-6 p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 text-xs text-amber-200/90 flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>
            Precisa de ajuda para configurar sua lista ou aplicativo? Fale conosco direto no WhatsApp!
          </span>
        </div>

        {/* Close CTA */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#241115] hover:bg-[#34161c] border border-[#591e27] text-white font-bold text-xs sm:text-sm transition cursor-pointer"
          >
            Entendi, fechar
          </button>
        </div>
      </div>
    </div>
  );
};

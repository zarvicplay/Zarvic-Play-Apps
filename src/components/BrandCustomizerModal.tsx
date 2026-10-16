import React, { useState } from 'react';
import { BrandConfig, AppItem } from '../types';
import { PRESET_LOGOS, DEFAULT_BRAND, DEFAULT_APPS } from '../data/defaultData';
import {
  X,
  Upload,
  Image as ImageIcon,
  Sliders,
  Palette,
  MessageCircle,
  QrCode,
  Layers,
  Download,
  RotateCcw,
  Check,
  Plus,
  Trash2,
  Edit2,
  Sparkles,
  Info,
  Share2,
  Globe,
} from 'lucide-react';

interface BrandCustomizerModalProps {
  isOpen: boolean;
  brand: BrandConfig;
  apps: AppItem[];
  onSaveBrand: (newBrand: BrandConfig) => void;
  onSaveApps: (newApps: AppItem[]) => void;
  onOpenAppEditor: (app?: AppItem) => void;
  onClose: () => void;
}

const COLOR_PRESETS = [
  { name: 'Vermelho Ruby (Original)', value: '#ff142b' },
  { name: 'Vermelho Netflix', value: '#e50914' },
  { name: 'Azul Neon', value: '#2563eb' },
  { name: 'Verde Esmeralda', value: '#10b981' },
  { name: 'Dourado Vip', value: '#eab308' },
  { name: 'Roxo Cyber', value: '#9333ea' },
  { name: 'Ciano Elétrico', value: '#06b6d4' },
];

export const BrandCustomizerModal: React.FC<BrandCustomizerModalProps> = ({
  isOpen,
  brand,
  apps,
  onSaveBrand,
  onSaveApps,
  onOpenAppEditor,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'logo' | 'opengraph' | 'whatsapp' | 'pix' | 'apps' | 'backup'>('logo');
  const [brandForm, setBrandForm] = useState<BrandConfig>(brand);
  const [savedFeedback, setSavedFeedback] = useState(false);

  if (!isOpen) return null;

  // Handle local image file upload for logo
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (recommend < 3MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('A imagem é muito pesada. Por favor escolha uma imagem de até 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setBrandForm((prev) => ({
            ...prev,
            logoUrl: event.target!.result as string,
            logoType: prev.logoType === 'text' ? 'both' : prev.logoType,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle local image file upload for hero banner cover
  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert('A imagem é muito pesada. Por favor escolha uma imagem de até 8MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setBrandForm((prev) => ({
            ...prev,
            bannerUrl: event.target!.result as string,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle local image file upload for Favicon (Browser Tab Icon)
  const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('O favicon deve ter até 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setBrandForm((prev) => ({
            ...prev,
            faviconUrl: event.target!.result as string,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle local image file upload for OpenGraph Social Share Card
  const handleOgImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert('A imagem do OpenGraph deve ter até 8MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setBrandForm((prev) => ({
            ...prev,
            ogImageUrl: event.target!.result as string,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle PIX QR image upload
  const handlePixQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setBrandForm((prev) => ({
            ...prev,
            pixQrImageUrl: event.target!.result as string,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyPreset = (preset: typeof PRESET_LOGOS[0]) => {
    setBrandForm((prev) => ({
      ...prev,
      name: preset.brandText,
      nameHighlight: preset.brandHighlight,
      logoUrl: preset.url || prev.logoUrl,
      primaryColor: preset.color,
    }));
  };

  const handleSaveAll = () => {
    onSaveBrand(brandForm);
    setSavedFeedback(true);
    setTimeout(() => {
      setSavedFeedback(false);
      onClose();
    }, 1200);
  };

  const handleExportJson = () => {
    const data = {
      brand: brandForm,
      apps: apps,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `configuracao-central-downloads.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.brand) {
            setBrandForm(parsed.brand);
            onSaveBrand(parsed.brand);
          }
          if (parsed.apps && Array.isArray(parsed.apps)) {
            onSaveApps(parsed.apps);
          }
          alert('Configurações importadas com sucesso!');
        } catch {
          alert('Arquivo JSON inválido.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleResetToDefault = () => {
    if (confirm('Deseja restaurar todas as configurações originais (CASHMOVIE)?')) {
      setBrandForm(DEFAULT_BRAND);
      onSaveBrand(DEFAULT_BRAND);
      onSaveApps(DEFAULT_APPS);
      alert('Configurações restauradas para o padrão!');
    }
  };

  const handleDeleteApp = (id: string, name: string) => {
    if (confirm(`Remover "${name}" do catálogo?`)) {
      const filtered = apps.filter((a) => a.id !== id);
      onSaveApps(filtered);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl rounded-2xl border border-[#71303a] bg-[#120a0c] p-4 sm:p-7 shadow-2xl text-white my-6 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#3e171c]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-rose-700 flex items-center justify-center shadow-lg shadow-red-950/50">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white">
                Personalizar Sua Central com Sua Logo
              </h2>
              <p className="text-xs text-neutral-400">
                Altere o logo, o nome da sua marca, número de WhatsApp, chave PIX e aplicativos.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Fechar"
            className="p-1.5 rounded-lg bg-[#251216] hover:bg-[#38181f] text-neutral-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex flex-wrap gap-2 py-3 border-b border-[#2d1217] text-xs font-semibold">
          <button
            onClick={() => setActiveTab('logo')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition cursor-pointer ${
              activeTab === 'logo'
                ? 'bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-md'
                : 'bg-[#1c0f12] text-neutral-300 hover:text-white hover:bg-[#2c151a]'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Sua Logo & Cores</span>
          </button>

          <button
            onClick={() => setActiveTab('opengraph')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition cursor-pointer ${
              activeTab === 'opengraph'
                ? 'bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-md'
                : 'bg-[#1c0f12] text-neutral-300 hover:text-white hover:bg-[#2c151a]'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Open Graph & Favicon</span>
          </button>

          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition cursor-pointer ${
              activeTab === 'whatsapp'
                ? 'bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-md'
                : 'bg-[#1c0f12] text-neutral-300 hover:text-white hover:bg-[#2c151a]'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp & Vendas</span>
          </button>

          <button
            onClick={() => setActiveTab('pix')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition cursor-pointer ${
              activeTab === 'pix'
                ? 'bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-md'
                : 'bg-[#1c0f12] text-neutral-300 hover:text-white hover:bg-[#2c151a]'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Chave PIX & Apoio</span>
          </button>

          <button
            onClick={() => setActiveTab('apps')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition cursor-pointer ${
              activeTab === 'apps'
                ? 'bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-md'
                : 'bg-[#1c0f12] text-neutral-300 hover:text-white hover:bg-[#2c151a]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Gerenciar APKs ({apps.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition cursor-pointer ${
              activeTab === 'backup'
                ? 'bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-md'
                : 'bg-[#1c0f12] text-neutral-300 hover:text-white hover:bg-[#2c151a]'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Backup & Exportar</span>
          </button>
        </div>

        {/* Modal Body with Scroll */}
        <div className="flex-1 overflow-y-auto py-4 space-y-6 pr-1 text-xs sm:text-sm">
          {/* TAB 1: LOGO & BRAND */}
          {activeTab === 'logo' && (
            <div className="space-y-6">
              {/* Live Preview Box */}
              <div className="p-4 rounded-xl border border-[#481c22] bg-[#090506] flex flex-col items-center justify-center text-center">
                <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 mb-2">
                  Pré-visualização do seu Topo / Header
                </span>

                {/* Banner Preview if present */}
                {brandForm.bannerUrl ? (
                  <div className="w-full max-w-xl mb-3 rounded-xl overflow-hidden border border-red-500/40 shadow-lg">
                    <img
                      src={brandForm.bannerUrl}
                      alt="Banner Preview"
                      className="w-full h-auto object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ) : null}

                <div className="flex items-center justify-center gap-3 py-2">
                  {brandForm.logoUrl && (brandForm.logoType === 'image' || brandForm.logoType === 'both') ? (
                    <img
                      src={brandForm.logoUrl}
                      alt="Logo Preview"
                      style={{ height: `${brandForm.logoHeight}px` }}
                      className="max-w-[240px] object-contain rounded-lg p-1 bg-black/40 border border-[#542126]"
                      referrerPolicy="no-referrer"
                    />
                  ) : null}

                  {!brandForm.bannerUrl && (brandForm.logoType === 'text' || brandForm.logoType === 'both' || !brandForm.logoUrl) && (
                    <span className="text-2xl sm:text-3xl font-black uppercase tracking-wider">
                      <span className="text-white">{brandForm.name}</span>{' '}
                      <span style={{ color: brandForm.primaryColor }}>{brandForm.nameHighlight}</span>
                    </span>
                  )}
                </div>

                <p className="text-xs text-neutral-400 mt-1 font-medium">{brandForm.tagline}</p>
              </div>

              {/* Upload Banner Cover File */}
              <div className="p-4 rounded-xl border border-[#3e171c] bg-[#170e10] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white text-sm">Capa / Banner do Topo</h4>
                    <p className="text-xs text-neutral-400">
                      Banner panorâmico exibido no topo (Central de Downloads Zarvic Play).
                    </p>
                  </div>
                  {brandForm.bannerUrl && (
                    <button
                      type="button"
                      onClick={() => setBrandForm({ ...brandForm, bannerUrl: '' })}
                      className="text-xs text-red-400 hover:text-red-300 font-medium underline cursor-pointer"
                    >
                      Remover Capa
                    </button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <label className="flex-1 flex flex-col items-center justify-center p-4 border-2 border-dashed border-[#61242c] hover:border-red-500 rounded-xl bg-[#0d0708] cursor-pointer transition group">
                    <Upload className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform mb-1" />
                    <span className="font-semibold text-white text-xs">
                      Trocar Imagem da Capa / Banner
                    </span>
                    <span className="text-[10px] text-neutral-500 mt-0.5">
                      Selecione uma imagem panorâmica para o topo
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBannerUpload}
                      className="hidden"
                    />
                  </label>

                  <div className="flex-1 space-y-2">
                    <label className="block text-xs font-semibold text-neutral-300">
                      Ou digite a URL da Imagem da Capa:
                    </label>
                    <input
                      type="url"
                      value={brandForm.bannerUrl || ''}
                      onChange={(e) => setBrandForm({ ...brandForm, bannerUrl: e.target.value })}
                      placeholder="https://meusite.com/meu-banner.png"
                      className="w-full px-3 py-2 rounded-lg bg-[#0d0708] border border-[#481c22] text-white text-xs focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>
              </div>

              {/* Upload Logo File */}
              <div className="p-4 rounded-xl border border-[#3e171c] bg-[#170e10] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white text-sm">Upload do seu Logo</h4>
                    <p className="text-xs text-neutral-400">
                      Envie uma imagem (.png transparente, .jpg ou .svg) do seu computador ou celular.
                    </p>
                  </div>
                  {brandForm.logoUrl && (
                    <button
                      type="button"
                      onClick={() => setBrandForm({ ...brandForm, logoUrl: '' })}
                      className="text-xs text-red-400 hover:text-red-300 font-medium underline cursor-pointer"
                    >
                      Remover Logo
                    </button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <label className="flex-1 flex flex-col items-center justify-center p-4 border-2 border-dashed border-[#61242c] hover:border-red-500 rounded-xl bg-[#0d0708] cursor-pointer transition group">
                    <Upload className="w-6 h-6 text-red-400 group-hover:scale-110 transition-transform mb-1" />
                    <span className="font-semibold text-white text-xs">
                      Clique para escolher a imagem da sua Logo
                    </span>
                    <span className="text-[10px] text-neutral-500 mt-0.5">
                      PNG com fundo transparente fica perfeito!
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>

                  <div className="flex-1 space-y-2">
                    <label className="block text-xs font-semibold text-neutral-300">
                      Ou digite a URL da Imagem da Logo:
                    </label>
                    <input
                      type="url"
                      value={brandForm.logoUrl}
                      onChange={(e) => setBrandForm({ ...brandForm, logoUrl: e.target.value })}
                      placeholder="https://meusite.com/minha-logo.png"
                      className="w-full px-3 py-2 rounded-lg bg-[#0d0708] border border-[#481c22] text-white text-xs focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                {/* Logo Height and Mode Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Altura da Logo: <strong className="text-red-400">{brandForm.logoHeight}px</strong>
                    </label>
                    <input
                      type="range"
                      min="30"
                      max="110"
                      value={brandForm.logoHeight}
                      onChange={(e) => setBrandForm({ ...brandForm, logoHeight: Number(e.target.value) })}
                      className="w-full accent-red-600 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Modo de Exibição
                    </label>
                    <select
                      value={brandForm.logoType}
                      onChange={(e) => setBrandForm({ ...brandForm, logoType: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-lg bg-[#0d0708] border border-[#481c22] text-white text-xs focus:outline-none focus:border-red-500"
                    >
                      <option value="both">Imagem da Logo + Nome em Texto</option>
                      <option value="image">Apenas a Imagem da Logo</option>
                      <option value="text">Apenas o Nome em Texto</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Brand Name & Tagline */}
              <div className="p-4 rounded-xl border border-[#3e171c] bg-[#170e10] space-y-3">
                <h4 className="font-bold text-white text-sm">Nome da Marca & Textos</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-neutral-300 font-semibold mb-1">
                      Primeira parte do Nome
                    </label>
                    <input
                      type="text"
                      value={brandForm.name}
                      onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })}
                      placeholder="Ex: CASH ou MINHA"
                      className="w-full px-3 py-2 rounded-lg bg-[#0d0708] border border-[#481c22] text-white focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-neutral-300 font-semibold mb-1">
                      Segunda parte (Destaque em Cor)
                    </label>
                    <input
                      type="text"
                      value={brandForm.nameHighlight}
                      onChange={(e) => setBrandForm({ ...brandForm, nameHighlight: e.target.value })}
                      placeholder="Ex: MOVIE ou PLAY"
                      className="w-full px-3 py-2 rounded-lg bg-[#0d0708] border border-[#481c22] text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-neutral-300 font-semibold mb-1">
                    Slogan / Subtítulo
                  </label>
                  <input
                    type="text"
                    value={brandForm.tagline}
                    onChange={(e) => setBrandForm({ ...brandForm, tagline: e.target.value })}
                    placeholder="Central de Downloads de Aplicativos para TV Box e Android"
                    className="w-full px-3 py-2 rounded-lg bg-[#0d0708] border border-[#481c22] text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-neutral-300 font-semibold mb-1">
                    Aviso em Destaque no Topo (Opcional)
                  </label>
                  <input
                    type="text"
                    value={brandForm.announcementText || ''}
                    onChange={(e) => setBrandForm({ ...brandForm, announcementText: e.target.value })}
                    placeholder="⚡ Todos os aplicativos testados e livres de vírus."
                    className="w-full px-3 py-2 rounded-lg bg-[#0d0708] border border-[#481c22] text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Color Palette */}
              <div className="p-4 rounded-xl border border-[#3e171c] bg-[#170e10] space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-sm">Cor Principal de Destaque</h4>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full border border-white/40" style={{ backgroundColor: brandForm.primaryColor }} />
                    <input
                      type="color"
                      value={brandForm.primaryColor}
                      onChange={(e) => setBrandForm({ ...brandForm, primaryColor: e.target.value })}
                      className="w-7 h-7 rounded border-0 bg-transparent cursor-pointer"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {COLOR_PRESETS.map((cp) => (
                    <button
                      key={cp.value}
                      type="button"
                      onClick={() => setBrandForm({ ...brandForm, primaryColor: cp.value })}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition ${
                        brandForm.primaryColor === cp.value
                          ? 'border-white bg-[#2b1014] text-white shadow'
                          : 'border-[#3f191f] bg-[#0d0708] text-neutral-300 hover:border-neutral-500'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cp.value }} />
                      <span>{cp.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Presets */}
              <div className="p-4 rounded-xl border border-[#3e171c] bg-[#170e10] space-y-3">
                <h4 className="font-bold text-white text-sm">Exemplos Prontos de Inspiração</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {PRESET_LOGOS.map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => handleApplyPreset(p)}
                      className="p-2.5 rounded-lg border border-[#481c22] bg-[#0d0708] hover:border-red-500 text-left transition cursor-pointer"
                    >
                      <span className="font-bold block text-white text-xs">{p.name}</span>
                      <span className="text-[10px] text-neutral-400">
                        {p.brandText} <strong style={{ color: p.color }}>{p.brandHighlight}</strong>
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Callout to OpenGraph & Favicon inside Logo tab */}
              <div className="p-3.5 rounded-xl border border-cyan-900/60 bg-cyan-950/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-900/50 flex items-center justify-center flex-shrink-0 text-cyan-300">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-xs">Foto do WhatsApp (Open Graph) & Favicon</h5>
                    <p className="text-[11px] text-neutral-400">Configure a imagem de compartilhamento e o ícone da aba do navegador.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('opengraph')}
                  className="px-3 py-1.5 rounded-lg bg-cyan-900/60 hover:bg-cyan-800 text-cyan-200 border border-cyan-700/60 text-xs font-semibold transition cursor-pointer flex-shrink-0"
                >
                  Configurar Open Graph & Favicon →
                </button>
              </div>
            </div>
          )}

          {/* TAB: OPEN GRAPH & FAVICON */}
          {activeTab === 'opengraph' && (
            <div className="space-y-6">
              {/* SECTION 1: OPEN GRAPH (FOTO WHATSAPP & REDES) */}
              <div className="p-4 sm:p-5 rounded-xl border border-[#3e171c] bg-[#170e10] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-red-950/80 border border-red-800/60 flex items-center justify-center text-red-400">
                      <Share2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Open Graph (Foto de Compartilhamento)</h4>
                      <p className="text-xs text-neutral-400">
                        Esta é a foto que aparece automaticamente quando você envia o link no WhatsApp, Telegram e redes.
                      </p>
                    </div>
                  </div>

                  {brandForm.ogImageUrl && (
                    <button
                      type="button"
                      onClick={() => setBrandForm({ ...brandForm, ogImageUrl: '/og-image.jpg' })}
                      className="text-xs text-red-400 hover:text-red-300 font-medium underline cursor-pointer"
                    >
                      Restaurar Foto Oficial
                    </button>
                  )}
                </div>

                {/* WhatsApp Link Card Simulation Mockup */}
                <div className="p-3.5 rounded-xl bg-[#0b1410] border border-emerald-900/50 max-w-md mx-auto">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Pré-visualização do Link no WhatsApp
                  </div>

                  <div className="rounded-lg overflow-hidden border border-emerald-800/40 bg-[#12221b] shadow-md">
                    <div className="w-full aspect-video max-h-[190px] overflow-hidden bg-black flex items-center justify-center">
                      <img
                        src={brandForm.ogImageUrl || '/og-image.jpg'}
                        alt="OpenGraph Preview"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="p-2.5">
                      <h5 className="font-bold text-white text-xs truncate">
                        {brandForm.name} {brandForm.nameHighlight} | Central de Downloads APK
                      </h5>
                      <p className="text-[11px] text-neutral-300 line-clamp-2 mt-0.5 leading-snug">
                        {brandForm.tagline || 'Central de downloads de aplicativos APK para TV Box, Smart TV e Celulares com suporte WhatsApp.'}
                      </p>
                      <span className="text-[10px] text-emerald-400/80 font-mono mt-1 block">
                        zarvicplay.app
                      </span>
                    </div>
                  </div>
                </div>

                {/* Upload and URL input */}
                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                  <label className="flex-1 flex flex-col items-center justify-center p-3.5 border-2 border-dashed border-[#61242c] hover:border-red-500 rounded-xl bg-[#0d0708] cursor-pointer transition group">
                    <Upload className="w-5 h-5 text-red-400 group-hover:scale-110 transition-transform mb-1" />
                    <span className="font-semibold text-white text-xs">
                      Fazer Upload da Foto do Open Graph
                    </span>
                    <span className="text-[10px] text-neutral-500 mt-0.5">
                      Recomendado formato 16:9 (ex: 1280x720 ou 1200x630)
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleOgImageUpload}
                      className="hidden"
                    />
                  </label>

                  <div className="flex-1 space-y-2">
                    <label className="block text-xs font-semibold text-neutral-300">
                      Ou digite a URL da Imagem Open Graph:
                    </label>
                    <input
                      type="url"
                      value={brandForm.ogImageUrl || ''}
                      onChange={(e) => setBrandForm({ ...brandForm, ogImageUrl: e.target.value })}
                      placeholder="https://meusite.com/og-image.jpg"
                      className="w-full px-3 py-2 rounded-lg bg-[#0d0708] border border-[#481c22] text-white text-xs focus:outline-none focus:border-red-500"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setBrandForm({ ...brandForm, ogImageUrl: '/og-image.jpg' })}
                        className="text-[10px] px-2 py-1 rounded bg-[#2b1014] hover:bg-[#3d181f] text-red-300 border border-red-800/60 cursor-pointer"
                      >
                        Usar Arte Oficial Zarvic Play
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: FAVICON (ÍCONE DA ABA DO NAVEGADOR) */}
              <div className="p-4 sm:p-5 rounded-xl border border-[#3e171c] bg-[#170e10] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-950/80 border border-blue-800/60 flex items-center justify-center text-blue-400">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Favicon (Ícone da Aba do Navegador)</h4>
                      <p className="text-xs text-neutral-400">
                        O pequeno ícone que aparece ao lado do nome do site na aba do navegador do seu visitante.
                      </p>
                    </div>
                  </div>

                  {brandForm.faviconUrl && (
                    <button
                      type="button"
                      onClick={() => setBrandForm({ ...brandForm, faviconUrl: '' })}
                      className="text-xs text-red-400 hover:text-red-300 font-medium underline cursor-pointer"
                    >
                      Remover Favicon
                    </button>
                  )}
                </div>

                {/* Browser Tab Simulation Mockup */}
                <div className="p-3 rounded-xl bg-[#0a0809] border border-[#4a1c22] max-w-md mx-auto">
                  <span className="text-[10px] text-neutral-400 font-medium block mb-1.5">
                    Pré-visualização da Aba no Navegador:
                  </span>
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-t-lg bg-[#221619] border-t border-x border-[#59232c] text-white text-xs max-w-xs shadow">
                    <img
                      src={brandForm.faviconUrl || brandForm.ogImageUrl || '/og-image.jpg'}
                      alt="Favicon"
                      className="w-4 h-4 rounded-sm object-cover flex-shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <span className="truncate font-medium text-xs">
                      {brandForm.name} {brandForm.nameHighlight} | Central de Downloads
                    </span>
                    <span className="text-neutral-400 text-[10px] ml-1">×</span>
                  </div>
                  <div className="h-1 bg-[#221619] border-t border-[#59232c] rounded-b-md" />
                </div>

                {/* Upload and URL input */}
                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                  <label className="flex-1 flex flex-col items-center justify-center p-3.5 border-2 border-dashed border-[#61242c] hover:border-red-500 rounded-xl bg-[#0d0708] cursor-pointer transition group">
                    <Upload className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform mb-1" />
                    <span className="font-semibold text-white text-xs">
                      Fazer Upload do Ícone Favicon
                    </span>
                    <span className="text-[10px] text-neutral-500 mt-0.5">
                      Arquivos .png, .ico ou .svg (quadrado: 32x32 ou 64x64)
                    </span>
                    <input
                      type="file"
                      accept="image/*,.ico"
                      onChange={handleFaviconUpload}
                      className="hidden"
                    />
                  </label>

                  <div className="flex-1 space-y-2">
                    <label className="block text-xs font-semibold text-neutral-300">
                      Ou digite a URL da Imagem do Favicon:
                    </label>
                    <input
                      type="url"
                      value={brandForm.faviconUrl || ''}
                      onChange={(e) => setBrandForm({ ...brandForm, faviconUrl: e.target.value })}
                      placeholder="https://meusite.com/favicon.png"
                      className="w-full px-3 py-2 rounded-lg bg-[#0d0708] border border-[#481c22] text-white text-xs focus:outline-none focus:border-red-500"
                    />
                    <div className="flex flex-wrap gap-2">
                      {brandForm.logoUrl && (
                        <button
                          type="button"
                          onClick={() => setBrandForm({ ...brandForm, faviconUrl: brandForm.logoUrl })}
                          className="text-[10px] px-2 py-1 rounded bg-[#2b1014] hover:bg-[#3d181f] text-neutral-300 border border-neutral-700 cursor-pointer"
                        >
                          Usar mesma foto do Logo
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setBrandForm({ ...brandForm, faviconUrl: '/og-image.jpg' })}
                        className="text-[10px] px-2 py-1 rounded bg-[#2b1014] hover:bg-[#3d181f] text-neutral-300 border border-neutral-700 cursor-pointer"
                      >
                        Usar Arte Zarvic Play
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WHATSAPP */}
          {activeTab === 'whatsapp' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-emerald-900/50 bg-[#0c1811] space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <MessageCircle className="w-4 h-4" />
                  <span>Configuração do Botão de WhatsApp de Vendas</span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Quando o visitante clicar em <em>"Adquira nossa lista pelo WhatsApp"</em>, ele será direcionado diretamente para conversar com você!
                </p>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Número do WhatsApp (Apenas números com DDI + DDD) *
                  </label>
                  <input
                    type="text"
                    required
                    value={brandForm.whatsappNumber}
                    onChange={(e) => setBrandForm({ ...brandForm, whatsappNumber: e.target.value.replace(/\D/g, '') })}
                    placeholder="Ex: 5562984114810 (55 + DDD + Telefone)"
                    className="w-full px-3 py-2 rounded-lg bg-[#070e0a] border border-emerald-800/60 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                  <span className="text-[10px] text-neutral-400 mt-1 block">
                    Exemplo Brasil: 55 + DDD + 9 dígitos. Exemplo: <strong>5511999998888</strong>
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Texto de Exibição no Botão *
                  </label>
                  <input
                    type="text"
                    value={brandForm.whatsappDisplay}
                    onChange={(e) => setBrandForm({ ...brandForm, whatsappDisplay: e.target.value })}
                    placeholder="Ex: (62) 98411-4810"
                    className="w-full px-3 py-2 rounded-lg bg-[#070e0a] border border-emerald-800/60 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Mensagem Padrão Pré-preenchida
                  </label>
                  <textarea
                    rows={3}
                    value={brandForm.whatsappMessage}
                    onChange={(e) => setBrandForm({ ...brandForm, whatsappMessage: e.target.value })}
                    placeholder="Olá, gostaria de adquirir a lista de canais / filmes / séries..."
                    className="w-full px-3 py-2 rounded-lg bg-[#070e0a] border border-emerald-800/60 text-white focus:outline-none focus:border-emerald-500 resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PIX */}
          {activeTab === 'pix' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-[#3e171c] bg-[#170e10] space-y-3">
                <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                  <QrCode className="w-4 h-4" />
                  <span>Configuração de Apoio via PIX</span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  O painel de apoio lateral exibirá sua chave PIX com botão de cópia rápida e um QR Code gerado automaticamente.
                </p>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Chave PIX (E-mail, Telefone, CPF ou Chave Aleatória) *
                  </label>
                  <input
                    type="text"
                    value={brandForm.pixKey}
                    onChange={(e) => setBrandForm({ ...brandForm, pixKey: e.target.value })}
                    placeholder="sua-chave@pix.com"
                    className="w-full px-3 py-2 rounded-lg bg-[#0d0708] border border-[#481c22] text-white font-mono focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Nome do Beneficiário / Titular (Opcional)
                  </label>
                  <input
                    type="text"
                    value={brandForm.pixReceiverName}
                    onChange={(e) => setBrandForm({ ...brandForm, pixReceiverName: e.target.value })}
                    placeholder="Ex: Minha Empresa ou Nome"
                    className="w-full px-3 py-2 rounded-lg bg-[#0d0708] border border-[#481c22] text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Upload da Imagem do seu QR Code PIX (Opcional)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePixQrUpload}
                      className="text-xs text-neutral-300 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#2b1014] file:text-red-300 file:cursor-pointer"
                    />
                    {brandForm.pixQrImageUrl && (
                      <button
                        type="button"
                        onClick={() => setBrandForm({ ...brandForm, pixQrImageUrl: '' })}
                        className="text-xs text-neutral-400 hover:text-red-400 underline cursor-pointer"
                      >
                        Usar QR gerado
                      </button>
                    )}
                  </div>
                  <span className="text-[10px] text-neutral-400 mt-1 block">
                    Se não enviar foto, geramos o QR Code automaticamente a partir da sua chave PIX!
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Mensagem de Apoio
                  </label>
                  <textarea
                    rows={2}
                    value={brandForm.pixDescription}
                    onChange={(e) => setBrandForm({ ...brandForm, pixDescription: e.target.value })}
                    placeholder="Este site é gratuito. Se ajudou você, contribua..."
                    className="w-full px-3 py-2 rounded-lg bg-[#0d0708] border border-[#481c22] text-white focus:outline-none focus:border-red-500 resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: GERENCIAR APPS */}
          {activeTab === 'apps' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">Catálogo de Aplicativos</h4>
                  <p className="text-xs text-neutral-400">
                    Adicione, edite links ou remova aplicativos exibidos no catálogo.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenAppEditor()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold text-xs shadow cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Novo Aplicativo</span>
                </button>
              </div>

              <div className="space-y-2">
                {apps.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-[#3e171c] bg-[#160d0f] gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-[#241014] border border-[#542126] overflow-hidden flex items-center justify-center flex-shrink-0">
                        {item.icon ? (
                          <img src={item.icon} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-red-400 font-bold text-xs">{item.name.slice(0, 2)}</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-white text-xs sm:text-sm truncate">{item.name}</h5>
                          <span className="px-1.5 py-0.5 rounded bg-[#2b1014] text-red-300 text-[10px] font-medium">
                            {item.category}
                          </span>
                          {item.featured && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800 text-[9px] font-bold">
                              Destaque
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-neutral-400 truncate max-w-md">{item.url}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => onOpenAppEditor(item)}
                        className="p-1.5 rounded-lg bg-[#241216] hover:bg-[#381a20] text-neutral-300 hover:text-white transition cursor-pointer"
                        title="Editar"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteApp(item.id, item.name)}
                        className="p-1.5 rounded-lg bg-[#241216] hover:bg-red-950 text-neutral-300 hover:text-red-400 transition cursor-pointer"
                        title="Excluir"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: BACKUP & EXPORT */}
          {activeTab === 'backup' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-[#3e171c] bg-[#170e10] space-y-3">
                <h4 className="font-bold text-white text-sm">Backup e Exportação</h4>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Você pode salvar o arquivo de configuração (.json) contendo sua logo, contatos e catálogo para guardar em segurança ou migrar para outro servidor.
                </p>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleExportJson}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#241115] hover:bg-[#34161c] border border-[#591e27] text-white font-bold text-xs transition cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-red-400" />
                    <span>Baixar Arquivo JSON de Backup</span>
                  </button>

                  <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#241115] hover:bg-[#34161c] border border-[#591e27] text-white font-bold text-xs transition cursor-pointer">
                    <Upload className="w-4 h-4 text-emerald-400" />
                    <span>Restaurar de um Arquivo JSON</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportJson}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-red-900/40 bg-red-950/20 space-y-2">
                <h4 className="font-bold text-red-400 text-sm">Restaurar Padrões de Fábrica</h4>
                <p className="text-xs text-neutral-300">
                  Restaura o site para o tema e aplicativos originais do CASHMOVIE.
                </p>
                <button
                  type="button"
                  onClick={handleResetToDefault}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-950 hover:bg-red-900 text-red-200 border border-red-800 text-xs font-semibold transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restaurar Tudo para o Padrão Original</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-[#3e171c] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <Info className="w-4 h-4 text-red-400" />
            <span>As alterações são salvas automaticamente no navegador.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#201013] hover:bg-[#32171c] text-neutral-300 text-xs sm:text-sm font-semibold transition cursor-pointer"
            >
              Fechar
            </button>
            <button
              type="button"
              onClick={handleSaveAll}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-red-950/50 transition cursor-pointer active:scale-95"
            >
              {savedFeedback ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Salvo com Sucesso!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Aplicar & Salvar Alterações</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

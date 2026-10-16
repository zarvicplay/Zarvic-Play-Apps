/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { AppItem, BrandConfig } from './types';
import { DEFAULT_BRAND, DEFAULT_APPS } from './data/defaultData';
import { HeaderBanner } from './components/HeaderBanner';
import { AppCard } from './components/AppCard';
import { SidebarSupport } from './components/SidebarSupport';
import { QRCodeModal } from './components/QRCodeModal';
import { InstallGuideModal } from './components/InstallGuideModal';
import { BrandCustomizerModal } from './components/BrandCustomizerModal';
import { AppEditModal } from './components/AppEditModal';
import { useAdminMode } from './utils/admin';
import {
  Search,
  X,
  Sliders,
  Tv,
  Layers,
  Sparkles,
  HelpCircle,
  AlertTriangle,
  ArrowUp,
  Filter,
} from 'lucide-react';

const STORAGE_BRAND_KEY = 'apk_center_brand_config_v1';
const STORAGE_APPS_KEY = 'apk_center_apps_list_v1';

export default function App() {
  // Admin detection: Only shows edit/personalize tools inside Google AI Studio / dev environment
  const { isDevEnvironment, isAdmin, previewAsClient, setPreviewAsClient } = useAdminMode();

  // Load from localStorage or defaults
  const [brand, setBrand] = useState<BrandConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_BRAND_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.pixKey === 'douglasgsia@jim.com' || !parsed.pixKey) {
          parsed.pixKey = 'zarvicplay@gmail.com';
          parsed.pixReceiverName = 'ZARVIC PLAY';
        }
        if (!parsed.bannerUrl || parsed.name === 'CASH') {
          parsed.bannerUrl = '/src/assets/images/zarvic_play_banner_1792121254151.jpg';
          parsed.name = 'ZARVIC';
          parsed.nameHighlight = 'PLAY';
        }
        return { ...DEFAULT_BRAND, ...parsed };
      }
    } catch (e) {
      console.error('Error loading brand config', e);
    }
    return DEFAULT_BRAND;
  });

  const [apps, setApps] = useState<AppItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_APPS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const filtered = parsed.filter(
            (a: AppItem) => a.id !== 'app-xcip-player' && a.id !== 'app-smart-iptv'
          );
          localStorage.setItem(STORAGE_APPS_KEY, JSON.stringify(filtered));
          return filtered;
        }
      }
    } catch (e) {
      console.error('Error loading apps list', e);
    }
    return DEFAULT_APPS;
  });

  // UI state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [qrModalApp, setQrModalApp] = useState<AppItem | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isAppEditorOpen, setIsAppEditorOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<AppItem | null>(null);

  // Dynamically update favicon in browser tab
  useEffect(() => {
    if (brand.faviconUrl) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = brand.faviconUrl;
    }
  }, [brand.faviconUrl]);

  // Dynamically update og:image and twitter:image meta tags
  useEffect(() => {
    if (brand.ogImageUrl) {
      const ogImg = document.querySelector('meta[property="og:image"]');
      if (ogImg) ogImg.setAttribute('content', brand.ogImageUrl);
      const ogImgSec = document.querySelector('meta[property="og:image:secure_url"]');
      if (ogImgSec) ogImgSec.setAttribute('content', brand.ogImageUrl);
      const twImg = document.querySelector('meta[name="twitter:image"]');
      if (twImg) twImg.setAttribute('content', brand.ogImageUrl);
    }
  }, [brand.ogImageUrl]);

  // Save changes to localStorage
  const handleSaveBrand = (newBrand: BrandConfig) => {
    setBrand(newBrand);
    try {
      localStorage.setItem(STORAGE_BRAND_KEY, JSON.stringify(newBrand));
    } catch (e) {
      console.error('Failed to save brand to localStorage', e);
    }
  };

  const handleSaveApps = (newApps: AppItem[]) => {
    setApps(newApps);
    try {
      localStorage.setItem(STORAGE_APPS_KEY, JSON.stringify(newApps));
    } catch (e) {
      console.error('Failed to save apps to localStorage', e);
    }
  };

  const handleSaveSingleApp = (appToSave: AppItem) => {
    setApps((prev) => {
      const index = prev.findIndex((a) => a.id === appToSave.id);
      let updated: AppItem[];
      if (index >= 0) {
        updated = [...prev];
        updated[index] = appToSave;
      } else {
        updated = [appToSave, ...prev];
      }
      try {
        localStorage.setItem(STORAGE_APPS_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save app item', e);
      }
      return updated;
    });
  };

  const handleOpenAppEditor = (app?: AppItem) => {
    setEditingApp(app || null);
    setIsAppEditorOpen(true);
  };

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    apps.forEach((a) => {
      if (a.category) set.add(a.category);
    });
    return ['Todos', 'Destaques', ...Array.from(set)];
  }, [apps]);

  // Filtered Apps
  const filteredApps = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return apps.filter((app) => {
      // Category filter
      if (selectedCategory === 'Destaques' && !app.featured) {
        return false;
      }
      if (selectedCategory !== 'Todos' && selectedCategory !== 'Destaques' && app.category !== selectedCategory) {
        return false;
      }

      // Search term filter
      if (!term) return true;
      const matchText = `${app.name} ${app.category || ''} ${app.description || ''} ${app.compatibility || ''} ${app.version || ''}`.toLowerCase();
      return matchText.includes(term);
    });
  }, [apps, searchTerm, selectedCategory]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#070707] text-[#f6f3f3] flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* Top Banner / Hero with User's Logo */}
      <HeaderBanner
        brand={brand}
        isAdmin={isAdmin}
        isDevEnvironment={isDevEnvironment}
        previewAsClient={previewAsClient}
        onToggleClientPreview={() => setPreviewAsClient(!previewAsClient)}
        onOpenCustomizer={() => setIsCustomizerOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-[1500px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left / Main Column: Search, Categories & App Grid */}
          <section className="lg:col-span-8 space-y-6">
            {/* Search Bar & Filters */}
            <div className="space-y-3">
              <div className="relative max-w-2xl mx-auto lg:mx-0">
                <label className="flex items-center gap-3 w-full h-14 px-5 rounded-full border border-[#673039] bg-gradient-to-r from-[#171313] to-[#0c0a0a] shadow-lg shadow-red-950/20 focus-within:border-red-500 focus-within:shadow-red-900/40 transition-all">
                  <Search className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar aplicativo por nome, modelo ou categoria..."
                    className="w-full bg-transparent text-sm sm:text-base text-white placeholder-neutral-500 focus:outline-none"
                    aria-label="Buscar aplicativos"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
                      aria-label="Limpar busca"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </label>
              </div>

              {/* Category Pills & Count */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-md shadow-red-950/50 border border-red-400/30'
                          : 'bg-[#150e10] hover:bg-[#251216] text-neutral-300 border border-[#3e171c]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="text-xs text-neutral-400 font-mono">
                  <span className="text-white font-bold">{filteredApps.length}</span>{' '}
                  {filteredApps.length === 1 ? 'aplicativo encontrado' : 'aplicativos encontrados'}
                </div>
              </div>
            </div>

            {/* Apps Grid */}
            {filteredApps.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                {filteredApps.map((app) => (
                  <AppCard
                    key={app.id}
                    app={app}
                    primaryColor={brand.primaryColor}
                    onOpenQr={(selected) => setQrModalApp(selected)}
                  />
                ))}
              </div>
            ) : (
              /* Empty state */
              <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-[#542126] bg-[#110a0b] space-y-3">
                <div className="w-14 h-14 rounded-full bg-[#241014] flex items-center justify-center text-red-400">
                  <Search className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-white">Nenhum aplicativo encontrado</h3>
                <p className="text-xs sm:text-sm text-neutral-400 max-w-md">
                  Não encontramos nenhum APK com o termo "<strong>{searchTerm}</strong>". Tente buscar por outro nome ou limpe a busca.
                </p>
                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('Todos');
                    }}
                    className="px-4 py-2 rounded-lg bg-[#241115] hover:bg-[#34161c] text-white text-xs font-semibold border border-[#591e27] cursor-pointer"
                  >
                    Ver Todos os Aplicativos
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => handleOpenAppEditor()}
                      className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold cursor-pointer"
                    >
                      Adicionar Novo APK
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Security Caution Notice */}
            <div className="rounded-xl border border-[#481c22] bg-[#120a0c] p-4 flex items-start gap-3 text-xs text-neutral-300">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-950/80 border border-red-800 text-red-400 font-bold flex items-center justify-center text-sm">
                !
              </span>
              <div>
                <h4 className="font-bold text-white text-sm mb-1">Baixe com Atenção</h4>
                <p className="leading-relaxed text-[#bab1b1]">
                  Instale apenas aplicativos de fontes em que você confia. Confira a origem, as permissões e mantenha a proteção do Google Play Protect ativa no seu aparelho.
                </p>
              </div>
            </div>
          </section>

          {/* Right Column: Support & WhatsApp Sticky Sidebar */}
          <aside className="lg:col-span-4 lg:sticky lg:top-6 space-y-5">
            <SidebarSupport
              brand={brand}
              isAdmin={isAdmin}
              onOpenCustomizer={() => setIsCustomizerOpen(true)}
            />
          </aside>
        </div>
      </main>

      {/* Floating Action Button: ONLY visible in AI Studio Dev Mode */}
      {isAdmin && (
        <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2">
          <button
            onClick={() => setIsCustomizerOpen(true)}
            className="group flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-red-950/80 border border-red-400/50 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            title="Coloque sua própria Logo, Cores e WhatsApp (Invisível no link final do cliente)"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin group-hover:rotate-180 transition-transform" />
            <span>Colocar Minha Logo</span>
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-[#3e171c] bg-[#090506] py-8 px-4 text-center text-xs text-[#a9a0a0]">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="flex items-center justify-center gap-2">
            {brand.logoUrl ? (
              <img
                src={brand.logoUrl}
                alt={brand.name}
                className="h-7 object-contain rounded"
              />
            ) : null}
            <span className="font-heading font-black text-lg tracking-wider uppercase text-white">
              {brand.name}
              <span style={{ color: brand.primaryColor }}>{brand.nameHighlight}</span>
            </span>
          </div>

          <p className="max-w-xl mx-auto text-neutral-400">
            Central independente de links para aplicativos compatíveis com Android e TV Box.
          </p>

          <p className="text-[11px] text-neutral-500 max-w-lg mx-auto">
            Use apenas arquivos que você tem autorização legal para distribuir. Este site não hospeda arquivos protegidos por direitos autorais diretamente em seus servidores.
          </p>

          <div className="pt-2 flex items-center justify-center gap-4 text-[11px]">
            <button
              onClick={() => setIsGuideOpen(true)}
              className="text-neutral-400 hover:text-white underline cursor-pointer"
            >
              Guia TV Box
            </button>
            {isAdmin && (
              <>
                <span>•</span>
                <button
                  onClick={() => setIsCustomizerOpen(true)}
                  className="text-red-400 hover:text-red-300 underline cursor-pointer font-semibold"
                >
                  Personalizar Marca & Logo
                </button>
              </>
            )}
            <span>•</span>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 text-neutral-400 hover:text-white cursor-pointer"
            >
              <span>Voltar ao topo</span>
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <QRCodeModal
        app={qrModalApp}
        onClose={() => setQrModalApp(null)}
      />

      <InstallGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {isAdmin && (
        <>
          <BrandCustomizerModal
            isOpen={isCustomizerOpen}
            brand={brand}
            apps={apps}
            onSaveBrand={handleSaveBrand}
            onSaveApps={handleSaveApps}
            onOpenAppEditor={handleOpenAppEditor}
            onClose={() => setIsCustomizerOpen(false)}
          />

          <AppEditModal
            isOpen={isAppEditorOpen}
            app={editingApp}
            onSave={handleSaveSingleApp}
            onClose={() => {
              setIsAppEditorOpen(false);
              setEditingApp(null);
            }}
          />
        </>
      )}
    </div>
  );
}

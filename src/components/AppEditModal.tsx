import React, { useState, useEffect } from 'react';
import { AppItem } from '../types';
import { X, Save, Plus, HardDrive, Link, Image, Tag, Tv } from 'lucide-react';

interface AppEditModalProps {
  isOpen: boolean;
  app: AppItem | null;
  onSave: (app: AppItem) => void;
  onClose: () => void;
}

export const AppEditModal: React.FC<AppEditModalProps> = ({
  isOpen,
  app,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState<AppItem>({
    id: '',
    name: '',
    category: 'Players',
    description: '',
    version: '1.0',
    size: '25 MB',
    compatibility: 'TV Box & Celular Android',
    downloaderCode: '',
    icon: '',
    url: '',
    featured: false,
  });

  useEffect(() => {
    if (app) {
      setFormData(app);
    } else {
      setFormData({
        id: `app-${Date.now()}`,
        name: '',
        category: 'Players',
        description: '',
        version: 'APK',
        size: '30 MB',
        compatibility: 'TV Box, Smart TV & Android',
        downloaderCode: '',
        icon: '',
        url: '',
        featured: false,
      });
    }
  }, [app, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.url.trim()) {
      alert('Por favor, preencha o Nome e o Link (URL) do aplicativo.');
      return;
    }
    onSave(formData);
    onClose();
  };

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData((prev) => ({ ...prev, icon: event.target!.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-lg rounded-2xl border border-[#71303a] bg-[#120a0c] p-6 shadow-2xl text-white my-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-[#251216] hover:bg-[#38181f] text-neutral-400 hover:text-white transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-white mb-1">
          {app ? 'Editar Aplicativo' : 'Adicionar Novo Aplicativo'}
        </h3>
        <p className="text-xs text-neutral-400 mb-5">
          Preencha as informações do APK para exibir no catálogo.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          {/* Nome */}
          <div>
            <label className="block text-neutral-300 font-semibold mb-1">
              Nome do Aplicativo *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: IBO Player Pro"
              className="w-full px-3 py-2 rounded-lg bg-[#1a0f12] border border-[#481c22] text-white focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Categoria & Versão */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-300 font-semibold mb-1">
                Categoria
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#1a0f12] border border-[#481c22] text-white focus:outline-none focus:border-red-500"
              >
                <option value="Players">Players</option>
                <option value="TV Box">TV Box</option>
                <option value="Ferramentas">Ferramentas</option>
                <option value="Streaming">Streaming</option>
                <option value="Utilitários">Utilitários</option>
              </select>
            </div>

            <div>
              <label className="block text-neutral-300 font-semibold mb-1">
                Versão
              </label>
              <input
                type="text"
                value={formData.version}
                onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                placeholder="Ex: v2.1 ou APK para TV"
                className="w-full px-3 py-2 rounded-lg bg-[#1a0f12] border border-[#481c22] text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          {/* Link URL do APK */}
          <div>
            <label className="block text-neutral-300 font-semibold mb-1">
              Link Direto de Download (URL do APK) *
            </label>
            <input
              type="url"
              required
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://exemplo.com/meu-app.apk"
              className="w-full px-3 py-2 rounded-lg bg-[#1a0f12] border border-[#481c22] text-white focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Ícone */}
          <div>
            <label className="block text-neutral-300 font-semibold mb-1">
              Ícone do Aplicativo (Imagem)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="URL da imagem (PNG ou JPG)"
                className="flex-1 px-3 py-2 rounded-lg bg-[#1a0f12] border border-[#481c22] text-white focus:outline-none focus:border-red-500"
              />
              <label className="px-3 py-2 rounded-lg bg-[#2b1216] hover:bg-[#3d181f] border border-[#6b2630] text-red-300 text-xs font-semibold cursor-pointer flex items-center gap-1">
                <span>Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleIconUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Tamanho e Código Downloader */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-300 font-semibold mb-1">
                Tamanho Estimado
              </label>
              <input
                type="text"
                value={formData.size || ''}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                placeholder="Ex: 48 MB"
                className="w-full px-3 py-2 rounded-lg bg-[#1a0f12] border border-[#481c22] text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-semibold mb-1">
                Código Downloader (Opcional)
              </label>
              <input
                type="text"
                value={formData.downloaderCode || ''}
                onChange={(e) => setFormData({ ...formData, downloaderCode: e.target.value })}
                placeholder="Ex: 591024"
                className="w-full px-3 py-2 rounded-lg bg-[#1a0f12] border border-[#481c22] text-white focus:outline-none focus:border-red-500 font-mono"
              />
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-neutral-300 font-semibold mb-1">
              Descrição
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Breve descrição dos recursos e compatibilidade..."
              className="w-full px-3 py-2 rounded-lg bg-[#1a0f12] border border-[#481c22] text-white focus:outline-none focus:border-red-500 resize-none"
            />
          </div>

          {/* Destaque Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured || false}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-4 h-4 rounded text-red-600 focus:ring-0 accent-red-600 cursor-pointer"
            />
            <label htmlFor="featured" className="text-neutral-300 cursor-pointer">
              Marcar como <strong>Destaque</strong> no topo do catálogo
            </label>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-3 border-t border-[#3e171c]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#241115] hover:bg-[#34161c] text-neutral-300 font-medium transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold transition shadow-md cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Aplicativo</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

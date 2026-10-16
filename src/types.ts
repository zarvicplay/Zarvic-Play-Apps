export interface AppItem {
  id: string;
  name: string;
  category: 'Players' | 'TV Box' | 'Streaming' | 'Ferramentas' | string;
  description: string;
  version: string;
  size?: string;
  compatibility?: string;
  downloaderCode?: string;
  icon: string;
  url: string;
  featured?: boolean;
  downloadsCount?: number;
}

export interface BrandConfig {
  name: string;
  nameHighlight: string;
  tagline: string;
  logoUrl: string;
  logoType: 'image' | 'text' | 'both';
  logoHeight: number;
  primaryColor: string; // e.g. '#ff142b'
  whatsappNumber: string; // e.g. '5562984114810'
  whatsappDisplay: string; // e.g. '(62) 98411-4810'
  whatsappMessage: string;
  pixKey: string;
  pixReceiverName: string;
  pixQrImageUrl?: string;
  pixDescription: string;
  announcementText?: string;
}

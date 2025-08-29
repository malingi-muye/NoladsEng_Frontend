import type { Product as ServerProduct } from '@shared/api';

export interface ProductExtended extends ServerProduct {
  image: string;           // Alias for image_url
  inStock: boolean;        // Computed from stock_quantity
  badge?: string;         // UI-specific field
  rating?: number;        // UI-specific field
  reviews?: number;       // UI-specific field
  tags: string[];         // UI-specific field
}

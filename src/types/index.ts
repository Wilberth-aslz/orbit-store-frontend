export type Role = "ADMIN" | "USER";

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  createdAt: string;
  _count?: { products: number };
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  categoryId: number;
  category: Category;
  createdAt: string;
  updatedAt: string;
}

export interface Favorite {
  id: number;
  userId: number;
  productId: number;
  createdAt: string;
  product: Product;
}

export interface ApiListMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export interface ApiListResponse<T> {
  success: boolean;
  data: T[];
  meta: ApiListMeta;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// --- Tipos para el panel de control del admin (/api/dashboard) ---
export interface DashboardCategorySummary {
  category: string;
  slug: string;
  productCount: number;
  inventoryValue: number;
}

export interface DashboardLowStockItem {
  id: number;
  name: string;
  stock: number;
  category: string;
  status: "critical" | "warning";
}

export interface DashboardSummary {
  totals: {
    products: number;
    categories: number;
    users: number;
    inventoryValue: number;
  };
  byCategory: DashboardCategorySummary[];
  lowStock: DashboardLowStockItem[];
}

// --- Tipos para la seccion "Tendencias" que consume la API externa
// FakeStore (https://fakestoreapi.com) ---
export interface FakeStoreProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: { rate: number; count: number };
}

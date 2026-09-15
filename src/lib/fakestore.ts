import axios from "axios";
import type { FakeStoreProduct } from "../types";

// Cliente aparte (sin baseURL de nuestro backend ni interceptor de JWT):
// esta es la API EXTERNA que llena la seccion "Tendencias" del home,
// segun lo pedido en el reto ("uno de los apartados... mediante la
// consulta a una API").
const fakeStoreClient = axios.create({
  baseURL: "https://fakestoreapi.com",
});

export const TREND_CATEGORIES: { key: string; label: string }[] = [
  { key: "electronics", label: "Electronica" },
  { key: "jewelery", label: "Joyeria" },
  { key: "men's clothing", label: "Hombre" },
  { key: "women's clothing", label: "Mujer" },
];

export async function fetchTrendingByCategory(category: string, limit = 4): Promise<FakeStoreProduct[]> {
  // El endpoint por categoria de FakeStore no soporta `?limit` de forma
  // confiable, asi que se recorta en el cliente.
  const { data } = await fakeStoreClient.get<FakeStoreProduct[]>(
    `/products/category/${encodeURIComponent(category)}`
  );
  return data.slice(0, limit);
}

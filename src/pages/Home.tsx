import { useEffect, useState } from "react";
import { CatalogSection } from "../components/home/CatalogSection";
import { Hero } from "../components/home/Hero";
import { TrendsSection } from "../components/home/TrendsSection";
import { api } from "../lib/api";
import type { Category } from "../types";

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState("");

  useEffect(() => {
    api
      .get("/categories")
      .then(({ data }) => setCategories(data.data))
      .catch(() => {
        // Si falla, el catalogo simplemente muestra la tab "Todo".
      });
  }, []);

  return (
    <div className="animate-fade-in">
      <Hero categories={categories} onPickCategory={setActiveCategory} />
      <CatalogSection categories={categories} activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
      <TrendsSection />
    </div>
  );
}

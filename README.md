# ORBIT Store — Frontend

Aplicacion **React + Vite + TypeScript + Tailwind CSS v4** para el reto de periodo de
prueba de Desarrollo de Software (Turing Inteligencia Artificial). Implementa el
Wireframe 1 con un tema de catalogo de productos.

## Stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- React Router v7
- Axios

## Requisitos

- Node.js 20+
- El backend corriendo en `http://localhost:4000` (ver `../backend/README.md`)

## Instalacion y ejecucion local

```bash
cd frontend
npm install

# Variables de entorno (ya apunta al backend local por defecto)
cp .env.example .env

npm run dev
```

Abre `http://localhost:5173`.

### Scripts disponibles

| Script          | Descripcion                          |
| ---------------- | -------------------------------------- |
| `npm run dev`    | Servidor de desarrollo con HMR         |
| `npm run build`  | Type-check + build de produccion       |
| `npm run preview`| Sirve el build de produccion localmente|
| `npm run lint`   | Linter (oxlint)                        |

## Estructura

```
src/
  components/
    home/        Hero, CatalogSection (backend propio), TrendsSection (API externa)
    layout/       Navbar, Footer, ProtectedRoute
    ui/            ProductCard, CategoryTabs, Modal, Spinner
  context/        AuthContext (JWT + usuario), ToastContext (notificaciones)
  lib/            api.ts (cliente axios a nuestro backend), fakestore.ts (API externa)
  pages/          Home, Login, Register, Favorites, admin/* (panel admin)
  types/          Tipos compartidos (Product, Category, User, etc.)
```

## Como cumple el reto (Wireframe 1)

| Elemento del wireframe                  | Implementacion                                                                 |
| ----------------------------------------- | --------------------------------------------------------------------------------- |
| Hero + 3 botones de categoria             | `components/home/Hero.tsx` — filtra el catalogo y hace scroll hacia el          |
| Grid 2x3 de tarjetas                      | `components/home/CatalogSection.tsx` — **datos de nuestro propio backend**       |
| Filtro de categoria + "cargar mas"        | Tabs de categoria + paginacion (boton "Cargar mas productos"), con axios         |
| 4 bloques de color                        | `components/home/TrendsSection.tsx` — **apartado lleno via API externa** (`fakestoreapi.com`), con tabs de categoria que disparan un nuevo fetch |
| Footer con 3 circulos                     | `components/layout/Footer.tsx`                                                    |

## Autenticacion y roles

- `AuthContext` guarda el JWT en `localStorage` y lo adjunta a cada peticion via
  interceptor de axios (`lib/api.ts`).
- `ProtectedRoute` protege `/favoritos` (cualquier usuario logueado) y `/admin`
  (solo rol `ADMIN`).
- El panel `/admin` permite CRUD completo de productos y categorias, y consulta de
  usuarios registrados (todo contra el backend propio).

## Responsivo

Layout con Tailwind (`grid`/`flex` + breakpoints `sm`/`md`/`lg`), probado desde ~360px
de ancho: el menu colapsa a hamburguesa, el grid de productos pasa de 3 a 2 a 1 columna.

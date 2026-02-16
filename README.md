# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Project structure (Feature-Sliced Design)

Base layers live in `src/`:

- `src/app` — app composition (providers, router, app shell)
- `src/pages` — routed pages (e.g. auth, products)
- `src/widgets` — large page blocks (header, tables, layouts)
- `src/features` — user actions (login/logout, product CRUD, search/sort/filter/pagination)
- `src/entities` — domain models (product, user)
- `src/shared` — reusable infrastructure (`shared/ui` for shadcn/ui, `shared/lib`, `shared/api`)
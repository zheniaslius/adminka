## Project structure (Feature-Sliced Design)

Base layers live in `src/`:

- `src/app` — app composition (providers, router, app shell)
- `src/pages` — routed pages (e.g. auth, products)
- `src/widgets` — large page blocks (header, tables, layouts)
- `src/features` — user actions (login/logout, product CRUD, search/sort/filter/pagination)
- `src/entities` — domain models (product, user)
- `src/shared` — reusable infrastructure (`shared/ui` for shadcn/ui, `shared/lib`, `shared/api`)

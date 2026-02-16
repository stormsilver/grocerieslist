# App Overview

Groceries is a multi-store grocery planning app that keeps a shared catalogue of household products and generates store-specific shopping runs. The UI is a React single-page app served by a Rails API-only backend; data changes are staged client-side and synchronized back to the API in batches.

## Main Workflows

- **Products inventory (`app/javascript/components/List.js`)** – Maintain the master list of items organized by category. Users can search, collapse sections, drag items between categories (Uncategorized bucket is injected client-side), and mark items as needed/not needed. Modal actions allow creating categories and items, and a debounced sync pushes edits to the API.
- **Shopping trip planning (`app/javascript/components/Shop.js`)** – Choose a store (`StoreSelector`) to plan a run. Items are split into ordered, unordered, and not-at-this-store buckets. Drag-and-drop reorders aisle order, assigns items to stores, or removes them. The `NeededItemsToggle` can hide already stocked items to generate a focused shopping list while edits sync automatically.
- **Global layout (`app/javascript/components/Layout.js`)** – Navigation exposes the Products and List tabs and surfaces a live sync indicator driven by `ApiProvider` mutation state so users know when background saves complete.

## Data Model Highlights

- **Items** belong to an account, carry a `needed` flag, and optionally link to a `Category`; each has many `StoreItem` records describing store placement and ordering.
- **Categories** are account-scoped groupings for organizing the product catalogue.
- **Stores** represent physical locations; `StoreItem.order` preserves aisle order per store, and unassigned items are still surfaced for planning.
- **Accounts/Users** exist for multi-tenant support; `Current` binds the active account/user for each request.

## Frontend Architecture

- React Router drives the two main routes while contexts (`ApiContext`, `CurrentStoreContext`) share data and selection state.
- Data fetching and mutations rely on React Query; `BagOfHolding` caches API resources, stages creations/updates/deletions, and issues bulk PATCHes via `Api.synchronize`/`Api.save`.
- Drag and drop is powered by `@dnd-kit` through `SortableLists`, enabling cross-list moves with custom collision handling and drag overlays.
- The component library leans on Bootstrap plus Bootstrap Icons with scoped styles under `app/assets/stylesheets/application.bootstrap.scss`.

## Backend API

- Rails runs in `config.api_only = true` mode and exposes `/api/items`, `/api/categories`, `/api/stores`, and `/api/store_items` endpoints with bulk PATCH handlers (`*_controller#update_bulk`) that accept arrays of records and return 422 validation errors when needed.
- Middleware (`SnakeCaseParameters`) and `Jbuilder.key_format` keep request params in snake_case while responses are camelCased for the frontend.
- `ApplicationController#authenticate_user!` currently seeds `Current.user`/`Current.account` with the first records, acting as a stub until real auth is added; seeds (`db/seeds.rb`) provide sample accounts, stores, and items for local development.

# Repository Guidelines

## Environment Setup

Run `bin/setup` after cloning to install gems, run `bun install`, prepare the database, and clear stale caches. Align your Ruby toolchain with `.ruby-version`; bundler will pin gem versions for you.

## Project Structure & Module Organization

Rails domain logic sits in `app/` (controllers, models, jobs, views). React modules live in `app/javascript/` with feature slices under `components/`, `contexts/`, `api/`, and `models/`; their bundles land in `app/assets/builds/`. Global configuration is under `config/`, while schema, seeds, and migrations live in `db/`. Tests reside in `test/` with fixtures in `test/fixtures/`, and reusable backend utilities belong in `lib/`.

## Build, Test, and Development Commands

- `bin/dev` runs the Rails server plus Bun asset watchers from `Procfile.dev`.
- `bun run build` performs a one-off JavaScript bundle; append `--watch` during iterative UI work.
- `bun run build:css` compiles SCSS via Sass and PostCSS.
- `bun run watch:css` keeps styles compiling on change.
- `bin/rails db:prepare` applies migrations and seeds before running suites or bootstrapping data.

## Coding Style & Naming Conventions

Use two-space indentation for Ruby and follow Rails naming (singular model classes, plural controllers ending with `Controller`). Keep service objects and jobs cohesive and in their dedicated subdirectories. Frontend code follows the React/Airbnb ESLint profile; name components in PascalCase, hooks in camelCase, and group co-located styles under the same folder. Format JavaScript and TypeScript with Prettier (`bunx prettier --write`) to enforce the 120-character width, single quotes, and trailing commas. Run `bundle exec rubocop` and `bunx eslint app/javascript` before opening a review to catch style regressions.

## Testing Guidelines

The suite uses Minitest with parallel workers. Name tests imperatively (`test 'returns inventory count' do`) and rely on fixtures for baseline data. Run `bin/rails test` for the full suite or scope to a path such as `bin/rails test test/models` when iterating. Keep system tests in `test/system/` focused on critical flows and ensure database state resets via `bin/rails db:test:prepare` when schema changes.

JS tests use vitest.

## Commit & Pull Request Guidelines

Keep commits small, descriptive, and imperative, mirroring the existing history (`"Add pantry item drag"`). Reference related issues and call out migrations, data backfills, or feature flags in the PR description. Include screenshots or console snippets for visible UI changes, and double-check that `bin/rails test` and key Bun build commands succeed before requesting review.

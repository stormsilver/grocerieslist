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

## Commit & Pull Request Guidelines
Keep commits small, descriptive, and imperative, mirroring the existing history (`"Add pantry item drag"`). Reference related issues and call out migrations, data backfills, or feature flags in the PR description. Include screenshots or console snippets for visible UI changes, and double-check that `bin/rails test` and key Bun build commands succeed before requesting review.

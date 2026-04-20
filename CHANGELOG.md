# [4.0.0](https://github.com/f820602h/design-token-demo/compare/v3.1.0...v4.0.0) (2026-04-20)


* feat!: migrate to single global token set and unified build output ([8f7bb7b](https://github.com/f820602h/design-token-demo/commit/8f7bb7bb19ed16d451f640f7ee0d705a5e98b998))


### BREAKING CHANGES

* output files renamed from light/dark variants to
unified files (tokens.css, _tokens.scss, tokens.js) to reflect new
single global token set structure

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>

# [3.1.0](https://github.com/f820602h/design-token-demo/compare/v3.0.0...v3.1.0) (2026-04-20)


### Features

* change color ([41677fb](https://github.com/f820602h/design-token-demo/commit/41677fb47bab1b205a66b3c03fc30f48868c262f))

# [3.0.0](https://github.com/f820602h/design-token-demo/compare/v2.0.0...v3.0.0) (2026-04-15)


* feat!: migrate to single token.json and simplify build pipeline ([5d43cb4](https://github.com/f820602h/design-token-demo/commit/5d43cb4c38d08329f2076156be313b9550275d6d))


### BREAKING CHANGES

* JS token file renamed from tokens.js to light.js / dark.js

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>

# [2.0.0](https://github.com/f820602h/design-token-demo/compare/v1.3.1...v2.0.0) (2026-04-08)


* feat!: restructure typography tokens and add CSS class generation ([d35917f](https://github.com/f820602h/design-token-demo/commit/d35917f3cab5bb9a0d8b025fe9f09a87c7d47266))


### BREAKING CHANGES

* "waring" renamed to "warning"; en-display and
en-heading tokens removed from Foundation

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>

## [1.3.1](https://github.com/f820602h/design-token-demo/compare/v1.3.0...v1.3.1) (2026-04-02)


### Bug Fixes

* update release assets to match light/dark theme build output ([1cc0d29](https://github.com/f820602h/design-token-demo/commit/1cc0d29856c546b839ef8d297715479ac5a3afc8))

# [1.3.0](https://github.com/f820602h/design-token-demo/compare/v1.2.0...v1.3.0) (2026-04-02)


### Features

* replace demo tokens with official brand token sets and support dark mode ([c2edec7](https://github.com/f820602h/design-token-demo/commit/c2edec7e7740e155b019f9d010d671d0826d957d))

# [1.2.0](https://github.com/f820602h/design-token-demo/compare/v1.1.0...v1.2.0) (2026-03-19)


### Features

* publish to GitHub Packages on release ([6f85ae9](https://github.com/f820602h/design-token-demo/commit/6f85ae926ac113e08e1216a6618ecf3ce35c6cd8))

# [1.1.0](https://github.com/f820602h/design-token-demo/compare/v1.0.0...v1.1.0) (2026-03-19)


### Features

* attach build artifacts to GitHub Release and remove build from repo ([a9808c9](https://github.com/f820602h/design-token-demo/commit/a9808c9dd42b1e0ab09167153eb49b2ce95fa7b4))

# 1.0.0 (2026-03-19)


### Bug Fixes

* remove duplicate pnpm version in workflows ([b2d66ee](https://github.com/f820602h/design-token-demo/commit/b2d66ee970740517ac9fc701dc2f19bde7cc26c3))
* upgrade node version to 22 for semantic-release compatibility ([600c100](https://github.com/f820602h/design-token-demo/commit/600c100b091fac557d1cae0c3e8ce6b1fe043913))


### Features

* initial project setup with Style Dictionary and Token Studio integration ([297d884](https://github.com/f820602h/design-token-demo/commit/297d8840e03d6281cc3e5a89b84522d9c8cb1338))

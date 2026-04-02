# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm build          # 編譯所有 token（CSS / SCSS / JS / JSON）
pnpm build:watch    # 監聽 tokens/ 變更自動重新編譯
```

## Architecture

### Token Pipeline

```
tokens/ (JSON)  →  config/style-dictionary.config.js  →  build/
```

Token 來源由設計師透過 **Token Studio (Figma plugin)** 直接 push 到 `tokens/`，使用 W3C DTCG 格式（`$type` / `$value`）。[config/style-dictionary.config.js](config/style-dictionary.config.js) 透過 `@tokens-studio/sd-transforms` + Style Dictionary v5 編譯為各平台產物。

### Token Sets

| 檔案 | 角色 |
|------|------|
| `tokens/Foundation/Light.json` | 原始色盤（brand、grey、status 色…）+ size scale + typography composites |
| `tokens/Foundation/Dark.json` | 暗色模式的原始色盤覆寫值 |
| `tokens/Semantic/Mode 1.json` | 語意 alias（text、border、background、radius、spacing、shadow） |
| `tokens/$themes.json` | Light / Dark theme 設定，控制哪些 token set 被載入 |
| `tokens/$metadata.json` | Token set 解析順序（Foundation 先、Semantic 後） |

`permutateThemes` 依 `$themes.json` 為每個 theme 產生獨立的 Style Dictionary 實例，分別 build。

### Build Output

| 檔案 | 說明 |
|------|------|
| `build/css/light.css` / `dark.css` | CSS 自訂屬性，selector 皆為 `:root`，消費端自行決定套用時機 |
| `build/scss/_light.scss` / `_dark.scss` | SCSS 變數 |
| `build/js/tokens.js` + `tokens.d.ts` | ES Module（light theme，camelCase） |
| `build/json/tokens.json` | Flat JSON（light theme） |

CSS/SCSS 變數名稱格式：`--c-{token-path-kebab-case}`（例如 `--c-color-text-primary`）。JS export 名稱為 camelCase（例如 `colorTextPrimary`）。

### Known Quirks

**Shadow collision**：`Foundation/Light.json` 有 `shadow.*`，`Semantic/Mode 1.json` 有 `Shadow.*`（大寫 S），值相同但 key 大小寫不同。`exclude-foundation-shadow` filter 在所有 platform 排除 Foundation 的 shadow tokens，只保留 Semantic 的版本。

**Font shorthand warning**：typography composite tokens 含有 `letterSpacing` 等非 CSS font shorthand 屬性，build 時會出現警告，屬正常行為，不影響輸出。

### Release Flow

Commit 格式需遵守 Conventional Commits（由 `commitlint` + `husky` 在 commit 時驗證）：
- `fix:` → patch
- `feat:` → minor
- `feat!:` 或 `BREAKING CHANGE` → major

Push 到 `main` 後，GitHub Actions 自動執行 `semantic-release`：bump 版號、產生 CHANGELOG、建立 GitHub Release、發佈至 GitHub Packages（`@f820602h/design-token-demo`）。

`tokens/` 有變動才觸發 Build workflow；每次 push `main` 都觸發 Release workflow。

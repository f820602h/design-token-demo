# Design Token

設計與工程之間的單一來源，將 [Token Studio](https://tokens.studio/) 定義的 Design Token 透過 [Style Dictionary](https://styledictionary.com/) 編譯為多種平台可用的格式，並自動發佈至 [GitHub Packages](https://github.com/f820602h/design-token-demo/pkgs/npm/design-token-demo)。

## 技術架構

| 工具 | 職責 |
|------|------|
| **Token Studio** | 設計師在 Figma 中定義與維護 Token |
| **Style Dictionary** | 將 Token JSON 編譯為 CSS / SCSS / JS / JSON |
| **semantic-release** | 依據 Commit 訊息自動判斷版號並發佈 |
| **GitHub Actions** | 自動化 Build 與 Release 流程 |
| **GitHub Packages** | 託管 npm 套件供前端專案安裝 |

## Token 類型

| 類型 | 路徑 | 說明 |
|------|------|------|
| Color Base | `tokens/color/base.json` | 原始色盤（neutral / blue / green / red / yellow）|
| Color Semantic | `tokens/color/semantic.json` | 語意別名（brand / text / bg / border / status）|
| Font Family | `tokens/typography/font-family.json` | 字型定義 |
| Font Size | `tokens/typography/font-size.json` | 字級 |
| Font Weight | `tokens/typography/font-weight.json` | 字重 |
| Line Height | `tokens/typography/line-height.json` | 行高 |
| Spacing | `tokens/spacing/spacing.json` | 間距 |
| Border Radius | `tokens/border-radius/border-radius.json` | 圓角 |
| Shadow | `tokens/shadow/shadow.json` | 陰影 |

## 編譯產出

每次 Release 會將以下檔案附加至 GitHub Release Assets，並透過 GitHub Packages 發佈：

| 檔案 | 用途 |
|------|------|
| `build/css/variables.css` | CSS 自訂屬性（`--ds-*`）|
| `build/scss/_variables.scss` | SCSS 變數 |
| `build/js/tokens.js` | ES Module |
| `build/js/tokens.d.ts` | TypeScript 型別宣告 |
| `build/json/tokens.json` | Flat JSON，供其他工具消費 |

---

## 協作流程

### 設計師：更新 Token

> 需要 Token Studio **Pro** 方案才能使用 GitHub Sync 功能

1. 在 Figma 開啟 **Tokens Studio** plugin
2. 前往 **Settings → Sync → GitHub**，填入以下資訊：

   | 欄位 | 值 |
   |------|-----|
   | Repository | `f820602h/design-token-demo` |
   | Branch | `main` |
   | Token Path | `tokens/` |
   | Secret | GitHub Personal Access Token（需要 `repo` 權限）|

3. 修改 Token 後，點擊 **Push to GitHub**
4. GitHub Actions 的 **Build Design Tokens** workflow 會自動觸發，驗證 Token 可正常編譯

> 設計師的 Push 只會驗證 build，**不會**觸發版本發佈。

---

### 開發者：發佈新版本

新版本的觸發條件是符合 [Conventional Commits](https://www.conventionalcommits.org/) 格式的 Commit。

**Commit 格式：**

```
<type>: <description>

[optional body]
```

**版號規則：**

| Commit 類型 | 範例 | 版號變化 |
|------------|------|---------|
| `fix:` | `fix: correct primary blue hex value` | `1.0.0` → `1.0.1` **PATCH** |
| `feat:` | `feat: add purple semantic color tokens` | `1.0.0` → `1.1.0` **MINOR** |
| `feat!:` 或 `BREAKING CHANGE` | `feat!: rename all token keys to kebab-case` | `1.0.0` → `2.0.0` **MAJOR** |

> `commitlint` + `husky` 會在本地 commit 時自動驗證格式，不符合規範的訊息會被攔截。

**Push 後 GitHub Actions 會自動：**

1. 編譯 Token（`pnpm build`）
2. 更新 `package.json` 版本號
3. 產生 / 更新 `CHANGELOG.md`
4. 建立 Git Tag 與 GitHub Release（附上 build 產物）
5. 發佈新版套件至 GitHub Packages

---

## 安裝套件

### 設定 registry

在前端專案根目錄建立或編輯 `.npmrc`：

```ini
@f820602h:registry=https://npm.pkg.github.com
```

### 安裝

```bash
pnpm add @f820602h/design-token-demo
```

### 使用

**CSS：**

```css
@import '@f820602h/design-token-demo/build/css/variables.css';

.button {
  background-color: var(--ds-color-brand-primary);
  border-radius: var(--ds-border-radius-md);
}
```

**SCSS：**

```scss
@use '@f820602h/design-token-demo/build/scss/variables' as *;

.button {
  background-color: $ds-color-brand-primary;
}
```

**JavaScript / TypeScript：**

```ts
import tokens from '@f820602h/design-token-demo/build/js/tokens.js'

console.log(tokens.ColorBrandPrimary) // #2563eb
```

---

## 本地開發

```bash
# 安裝依賴
pnpm install

# 編譯 Token
pnpm build

# 監聽變更自動重新編譯
pnpm build:watch
```

import StyleDictionary from 'style-dictionary'
import { register, permutateThemes } from '@tokens-studio/sd-transforms'
import { readFileSync } from 'fs'

// 註冊 Token Studio 的 transforms 與 preprocessors
register(StyleDictionary)

// 建立 kebab-case 版本的 transform group（將 name/camel 替換為 name/kebab）
StyleDictionary.registerTransformGroup({
  name: 'tokens-studio/kebab',
  transforms: StyleDictionary.hooks.transformGroups['tokens-studio'].map(
    t => (t === 'name/camel' ? 'name/kebab' : t)
  ),
})

// Foundation/Light 和 Semantic/Mode 1 都定義了相同的 shadow tokens（大小寫不同的 key），
// name transform 後會產生重複的識別字。統一保留 Semantic 的版本，排除 Foundation 的。
StyleDictionary.registerFilter({
  name: 'exclude-foundation-shadow',
  filter: token =>
    !(token.filePath.endsWith('Foundation/Light.json') && token.path[0].toLowerCase() === 'shadow'),
})

const themes = JSON.parse(readFileSync('./tokens/$themes.json', 'utf-8'))
const themeConfigs = permutateThemes(themes)

for (const [themeName, tokenSets] of Object.entries(themeConfigs)) {
  const isLight = themeName.toLowerCase() === 'light'
  const themeSlug = themeName.toLowerCase()

  const sd = new StyleDictionary({
    // 依 $themes.json 設定的 enabled token sets 依序載入
    source: /** @type {string[]} */ (tokenSets).map(set => `tokens/${set}.json`),
    preprocessors: ['tokens-studio'],

    platforms: {
      // 原生 CSS 自訂屬性，每個 theme 輸出獨立檔案
      css: {
        transformGroup: 'tokens-studio/kebab',
        prefix: 'c',
        buildPath: 'build/css/',
        files: [
          {
            destination: `${themeSlug}.css`,
            format: 'css/variables',
            options: {
              selector: ':root',
              outputReferences: true,
            },
          },
        ],
      },

      // SCSS 變數，每個 theme 輸出獨立檔案
      scss: {
        transformGroup: 'tokens-studio/kebab',
        prefix: 'c',
        buildPath: 'build/scss/',
        files: [
          {
            destination: `_${themeSlug}.scss`,
            format: 'scss/variables',
            options: { outputReferences: true },
          },
        ],
      },

      // JS / JSON 只輸出 light（作為預設值）
      ...(isLight && {
        js: {
          transformGroup: 'tokens-studio',
          buildPath: 'build/js/',
          files: [
            {
              destination: 'tokens.js',
              format: 'javascript/es6',
            },
            {
              destination: 'tokens.d.ts',
              format: 'typescript/es6-declarations',
            },
          ],
        },

        json: {
          transformGroup: 'tokens-studio',
          buildPath: 'build/json/',
          files: [
            {
              destination: 'tokens.json',
              format: 'json/flat',
            },
          ],
        },
      }),
    },
  })

  await sd.buildAllPlatforms()
}

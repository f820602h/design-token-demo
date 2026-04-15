import StyleDictionary from 'style-dictionary'
import { register } from '@tokens-studio/sd-transforms'
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

// 遞迴深度合併 token set 物件
/** @param {Record<string, any>} target @param {Record<string, any>} source */
function deepMerge(target, source) {
  const result = { ...target }
  for (const [key, value] of Object.entries(source)) {
    if (
      value && typeof value === 'object' && !Array.isArray(value) &&
      result[key] && typeof result[key] === 'object' && !Array.isArray(result[key])
    ) {
      result[key] = deepMerge(result[key], value)
    } else {
      result[key] = value
    }
  }
  return result
}

// 讀取單一 token.json，排除 $themes / $metadata 後拆出各 token set
const { '$themes': _t, '$metadata': _m, ...tokenSets } = JSON.parse(
  readFileSync('./token.json', 'utf-8')
)

// 各 theme 啟用的 token set（依解析優先序排列）
const THEME_SETS = {
  light: ['foundation_color/Light', 'foundation_size/Mode 1', 'semantic/Mode 1', 'component/Mode 1', 'text style', 'shadow'],
  dark:  ['foundation_color/Dark',  'foundation_size/Mode 1', 'semantic/Mode 1', 'component/Mode 1', 'text style', 'shadow'],
}

for (const [themeSlug, sets] of Object.entries(THEME_SETS)) {
  // 將各 token set 依序深度合併為單一 tokens 物件
  const tokens = sets.reduce((merged, set) => deepMerge(merged, tokenSets[set] ?? {}), {})

  const sd = new StyleDictionary({
    tokens,
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

      // JS，每個 theme 輸出獨立檔案
      js: {
        transformGroup: 'tokens-studio',
        buildPath: 'build/js/',
        files: [
          {
            destination: `${themeSlug}.js`,
            format: 'javascript/es6',
          },
        ],
      },
    },
  })

  await sd.buildAllPlatforms()
}

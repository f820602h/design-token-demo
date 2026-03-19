import StyleDictionary from 'style-dictionary'
import { register } from '@tokens-studio/sd-transforms'

// 註冊 Token Studio 的 transforms 與 preprocessors
register(StyleDictionary)

const sd = new StyleDictionary({
  // token 來源（支援 glob）
  // Token Studio 同步後會在此目錄產生 JSON 檔
  source: ['tokens/**/*.json'],

  // 排除 Token Studio 的 metadata 檔案
  preprocessors: ['tokens-studio'],

  platforms: {
    // 原生 CSS 自訂屬性
    css: {
      transformGroup: 'tokens-studio',
      prefix: 'ds',              // 產出 --ds-color-brand-primary
      buildPath: 'build/css/',
      files: [
        {
          destination: 'variables.css',
          format: 'css/variables',
          options: {
            selector: ':root',
            outputReferences: true, // alias 保留 var() 參照
          },
        },
      ],
    },

    // SCSS 變數
    scss: {
      transformGroup: 'tokens-studio',
      prefix: 'ds',
      buildPath: 'build/scss/',
      files: [
        {
          destination: '_variables.scss',
          format: 'scss/variables',
          options: { outputReferences: true },
        },
      ],
    },

    // JavaScript / TypeScript
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

    // Flat JSON（給其他工具消費）
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
  },
})

await sd.buildAllPlatforms()

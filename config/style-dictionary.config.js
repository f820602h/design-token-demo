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

// 讀取單一 token.json，取出 global token set
const { global: globalTokens } = JSON.parse(
  readFileSync('./token.json', 'utf-8')
)

const sd = new StyleDictionary({
  tokens: globalTokens,
  preprocessors: ['tokens-studio'],

  platforms: {
    css: {
      transformGroup: 'tokens-studio/kebab',
      prefix: 'c',
      buildPath: 'build/css/',
      files: [
        {
          destination: 'tokens.css',
          format: 'css/variables',
          options: {
            selector: ':root',
            outputReferences: true,
          },
        },
      ],
    },

    scss: {
      transformGroup: 'tokens-studio/kebab',
      prefix: 'c',
      buildPath: 'build/scss/',
      files: [
        {
          destination: '_tokens.scss',
          format: 'scss/variables',
          options: { outputReferences: true },
        },
      ],
    },

    js: {
      transformGroup: 'tokens-studio',
      buildPath: 'build/js/',
      files: [
        {
          destination: 'tokens.js',
          format: 'javascript/es6',
        },
      ],
    },
  },
})

await sd.buildAllPlatforms()

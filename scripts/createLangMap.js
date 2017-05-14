// @flow
import fs from 'fs'
import path from 'path'

import hljs from 'highlight.js'

const rootPath = path.resolve(__dirname, '..')
const map = {}
const generatedJsPath = path.resolve(rootPath, 'src', 'settings', 'languageNameMap.js')
const jsFilePattern = /(.*)\.js$/
const langsPath = path.resolve(rootPath, 'node_modules', 'highlight.js', 'lib', 'languages')
fs.readdirSync(langsPath)
  .map((f) => {
    const m = f.match(jsFilePattern)
    return (m && m[1]) || ''
  })
  .filter(n => n.length > 0)
  .forEach((lang) => {
    // $FlowFixMe
    const { aliases } = require(`highlight.js/lib/languages/${lang}`)(hljs)
    map[lang] = lang
    if (aliases != null) {
      aliases.forEach((a) => { map[a] = lang })
    }
  })

const scriptBody =
  [
    `// Automatically generated by ${path.relative(rootPath, __filename)} at ${new Date().toString()}`,
    '/* eslint-disable eslint-comments/no-unlimited-disable */',
    '// eslint-disable-next-line',
    `module.exports = ${JSON.stringify(map).replace(/"([^"]+)":\s*"([^"]+)"/g, '\'$1\':{name:\'$2\',load:() => import(\'highlight.js/lib/languages/$2\')}')}`,
    '/* eslint-enable eslint-comments/no-unlimited-disable */',
  ].join('\n')

fs.writeFileSync(generatedJsPath, scriptBody + '\n', { encoding: 'utf8' })
console.log(`Generate ${path.relative(rootPath, generatedJsPath)} successfully!`)

// https://github.com/vuejs/vue-cli/blob/dev/packages/%40vue/cli/lib/promptModules/vuex.js
// module.exports = cli => {
//   cli.injectFeature({
//     name: 'cssPreprocessor',
//     type: 'list',
//     ...
//   })

//   cli.injectPrompt({
//     name: 'routerHistoryMode',
//     when: answers => answers.features.includes('router'),
//     type: 'confirm',
//     ...
//   })

//   cli.onPromptComplete((answers, options) => {
//     if (answers.features.includes('router')) {
//       options.router = true
//       options.routerHistoryMode = answers.routerHistoryMode
//     }
//   })
// }

module.exports = [
  {
    name: 'cssPreprocessor',
    type: 'list',
    message: 'Add support for CSS pre-processors like Sass or Less',
    choices: [
      {
        name: 'Scss',
        value: 'scss'
      },
      {
        name: 'Less',
        value: 'less'
      },
      {
        name: 'Sass',
        value: 'sass'
      }
    ],
    default: 'scss'
  },
  {
    name: 'Vue Router mode',
    type: 'list',
    message: 'Choice Vue Router History mode',
    choices: [
      {
        name: 'Hash',
        value: 'hash'
      },
      {
        name: 'history',
        value: 'history'
      }
    ],
    default: 'hash'
  },
  {
    name: 'pwa',
    type: 'confirm',
    message: 'Progressive Web App (PWA) Support (default: None)',
    default: false
  },
  {
    name: 'ui-framework',
    type: 'list',
    message: 'choice UI Framework',
    choices: [
      {
        name: 'iView',
        value: 'iview'
      },
      {
        name: 'Element UI',
        value: 'element-ui'
      }
    ],
    default: 'iview'
  },
  {
    name: 'Server Port',
    type: 'input',
    message: 'Input DevServer Port(default: 8081)',
    default: '8081',
    validate: (n) => {
      return !isNaN(+n)
    }
  }
]

/// <reference types="cypress" />

let allResults

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  require('../../src')({
    on,
    filename: 'results.json',
    updateMarkdownFile: 'README.md',
  })
}

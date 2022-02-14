/// <reference types="cypress" />

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  // only register sending the results by email
  // if there is an email address
  if (process.env.EMAIL_RESULTS_TO) {
    console.log(
      'will email test results to %s',
      process.env.EMAIL_RESULTS_TO.slice(0, 3) + '...',
    )
    require('../../src')(on, config, { email: process.env.EMAIL_RESULTS_TO })
  } else {
    console.log('will not send email results')
  }
}

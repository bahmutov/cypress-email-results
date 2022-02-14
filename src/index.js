/// <reference types="cypress" />

const fs = require('fs')

function registerCypressEmailResults(on, config, options) {
  if (!options) {
    throw new Error('options is required')
  }
  if (!options.email) {
    throw new Error('options.email is required')
  }

  const emails = Array.isArray(options.email) ? options.email : [options.email]
  if (!on) {
    throw new Error('Missing required option: on')
  }

  // keeps all test results by spec
  let allResults

  // `on` is used to hook into various events Cypress emits
  on('before:run', () => {
    allResults = {}
  })

  on('after:spec', (spec, results) => {
    allResults[spec.relative] = {}
    // shortcut
    const r = allResults[spec.relative]
    results.tests.forEach((t) => {
      const testTitle = t.title.join(' ')
      r[testTitle] = t.state
    })
  })

  on('after:run', async (afterRun) => {
    // add the totals to the results
    // explanation of test statuses in the blog post
    // https://glebbahmutov.com/blog/cypress-test-statuses/
    allResults.totals = {
      suites: afterRun.totalSuites,
      tests: afterRun.totalTests,
      failed: afterRun.totalFailed,
      passed: afterRun.totalPassed,
      pending: afterRun.totalPending,
      skipped: afterRun.totalSkipped,
    }

    console.log(
      'cypress-email-results: sending results to %s',
      emails.join(', '),
    )
  })
}

module.exports = registerCypressEmailResults

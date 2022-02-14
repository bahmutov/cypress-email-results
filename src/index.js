/// <reference types="cypress" />

const fs = require('fs')
const { updateText } = require('./update-text')

function registerCypressJsonResults(options = {}) {
  const defaults = {
    filename: 'results.json',
  }
  options = { ...options, defaults }
  if (!options.on) {
    throw new Error('Missing required option: on')
  }

  // keeps all test results by spec
  let allResults

  // `on` is used to hook into various events Cypress emits
  options.on('before:run', () => {
    allResults = {}
  })

  options.on('after:spec', (spec, results) => {
    allResults[spec.relative] = {}
    // shortcut
    const r = allResults[spec.relative]
    results.tests.forEach((t) => {
      const testTitle = t.title.join(' ')
      r[testTitle] = t.state
    })
  })

  options.on('after:run', (afterRun) => {
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

    const str = JSON.stringify(allResults, null, 2)
    fs.writeFileSync(options.filename, str + '\n')
    console.log('cypress-json-results: wrote results to %s', options.filename)

    if (options.updateMarkdownFile) {
      const markdownFile = options.updateMarkdownFile
      const markdown = fs.readFileSync(markdownFile, 'utf8')
      const updated = updateText(markdown, allResults.totals)
      fs.writeFileSync(markdownFile, updated)
      console.log(
        'cypress-json-results: updated Markdown file %s',
        markdownFile,
      )
    }
  })
}

module.exports = registerCypressJsonResults

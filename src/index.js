/// <reference types="cypress" />

// https://nodemailer.com/about/
const nodemailer = require('nodemailer')

const initEmailTransport = () => {
  if (!process.env.SENDGRID_HOST) {
    throw new Error(`Missing SENDGRID_ variables`)
  }

  const host = process.env.SENDGRID_HOST
  const port = Number(process.env.SENDGRID_PORT)
  const secure = port === 465
  const auth = {
    user: process.env.SENDGRID_USER,
    pass: process.env.SENDGRID_PASSWORD,
  }

  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth,
  })
  return transporter
}

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

  const emailSender = options.transport || initEmailTransport()
  if (!emailSender) {
    throw new Error('Could not initialize emailSender')
  }
  if (!emailSender.sendMail) {
    throw new Error('emailSender does not have sendMail')
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
      'cypress-email-results: %d total tests, %d passes, %d failed, %d others',
      allResults.totals.tests,
      allResults.totals.passed,
      allResults.totals.failed,
      allResults.totals.pending + allResults.totals.skipped,
    )
    console.log(
      'cypress-email-results: sending results to %d email users',
      emails.length,
    )

    const emailOptions = {
      to: emails,
      from: process.env.SENDGRID_FROM,
      subject: 'Cypress test results',
      text: 'TODO: add results text',
    }

    await emailSender.sendMail(emailOptions)
    console.log('Cypress results emailed')
  })
}

module.exports = registerCypressEmailResults

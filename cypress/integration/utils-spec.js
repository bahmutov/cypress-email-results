/// <reference types="cypress" />

import { getCountTable, updateText } from '../../src/update-text'
import { stripIndent } from 'common-tags'

describe('Markdown utils', () => {
  it('forms table', () => {
    const totals = {
      passed: 10,
      failed: 2,
      pending: 1,
      skipped: 3,
      tests: 15,
    }
    const text = getCountTable(totals)
    expect(text).to.equal(stripIndent`
      Test status | Count
      ---|---
      Passed | 10
      Failed | 2
      Pending | 1
      Skipped | 3
      **Total** | 15
    `)
  })

  it('updates table in the text', () => {
    const text = stripIndent`
      This is some Markdown text
      and then there is a comment with the table

      <!-- cypress-test-counts -->
      Test status | Count
      ---|---
      Passed | 1
      Failed | 0
      Pending | 1
      Skipped | 0
      **Total** | 2
      <!-- cypress-test-counts-end -->

      the end
    `

    const totals = {
      passed: 10,
      failed: 2,
      pending: 1,
      skipped: 3,
      tests: 15,
    }

    const updated = updateText(text, totals)
    expect(updated).to.equal(stripIndent`
      This is some Markdown text
      and then there is a comment with the table

      <!-- cypress-test-counts -->
      Test status | Count
      ---|---
      Passed | 10
      Failed | 2
      Pending | 1
      Skipped | 3
      **Total** | 15
      <!-- cypress-test-counts-end -->

      the end
    `)
  })
})

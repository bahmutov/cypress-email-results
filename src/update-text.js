const { stripIndent } = require('common-tags')

const START = '<!-- cypress-test-counts -->'
const END = '<!-- cypress-test-counts-end -->'

function getCountTable(totals) {
  return stripIndent`
    Test status | Count
    ---|---
    Passed | ${totals.passed}
    Failed | ${totals.failed}
    Pending | ${totals.pending}
    Skipped | ${totals.skipped}
    **Total** | ${totals.tests}
  `
}

function updateText(text, totals) {
  const startIndex = text.indexOf(START)
  if (startIndex === -1) {
    throw new Error('Could not find cypress-test-counts comment')
  }

  const endIndex = text.indexOf(END)
  if (endIndex === -1) {
    throw new Error('Could not find cypress-test-counts-end comment')
  }

  const start = text.slice(0, startIndex)
  const end = text.slice(endIndex)
  const updatedTable = getCountTable(totals)
  return start + START + '\n' + updatedTable + '\n' + end
}

module.exports = {
  updateText,
  getCountTable,
}

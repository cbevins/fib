import * as ss from './spreadsheet.js'

const LedgerName = 'FIB' // name of the checking ledher worksheet
const firstRowIdx =  3
// Column indices
const TransDate = 0
const TransType = 1
const CheckNumb = 2
const Party = 3
const Desc = 4
const Amount = 5
const Balance = 6
const StmtDate = 7
const FirstAccount = 8

function reconcile(worksheet, reconDate) {
  const tally = {
    before: {dr: {amount: 0, n: 0}, cr: {amount: 0, n: 0}},
    during: {dr: {amount: 0, n: 0}, cr: {amount: 0, n: 0}},
    after: {dr: {amount: 0, n: 0}, cr: {amount: 0, n: 0}},
    next: {dr: {amount: 0, n: 0}, cr: {amount: 0, n: 0}},
    pending: {dr: {amount: 0, n: 0}, cr: {amount: 0, n: 0}},
    trans: []
  }
  const lastColIdx = ss.getLastColIdx(worksheet)
  const lastRowIdx = ss.getLastRowIdx(worksheet)
  for (let r=firstRowIdx; r<=lastRowIdx; r++) {
    const row = ss.getRow(worksheet, lastColIdx, r)
    // console.log(row)
    // Only process rows with defined TransDate and StmtDate
    let pot = ''
    if (row[TransDate] !== undefined) {
      if (row[Amount] === undefined) {
        throw new Error(`Row ${r} Amount is undefined`)
      }
      const amount = row[Amount].v
      if (row[TransType] !== 'transfer' && amount !== 0) { // transfer or void
        if (row[StmtDate] === undefined) {
          pot = 'next'
        } else if (row[StmtDate].v < 0) { // outstanding
          pot = 'pending'
        } else if (row[StmtDate].v < reconDate) {
          pot = 'before'
        } else if (row[StmtDate].v === reconDate) {
          pot = 'during'
          tally['trans'].push({
            date: row[TransDate].v,
            type: row[TransType].v,
            numb: row[CheckNumb] === undefined ? '' : row[CheckNumb].v,
            party: row[Party] === undefined ? '' : row[Party].v,
            desc: row[Desc] === undefined ? '' : row[Desc].v,
            amount: amount
          })
        } else if (row[StmtDate].v > reconDate) {
          pot = 'after'
        } else {
          throw new Error(`Row ${r} unhandled statement date '${row[StmtDate].v}'`)
        }
        const dc = amount < 0 ? 'dr' : 'cr'
        tally[pot][dc].amount += Math.abs(amount)
        tally[pot][dc].n++
      }
    }
  }
  return tally
}

function dollars(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount.toFixed(2))
}

function entry(e) {
  let str = e.date
  str += ' ' + e.type.padEnd(8, ' ')
  str += ' ' + e.numb.toString().padEnd(4, ' ')
  str += ' ' + e.party.padEnd(30, ' ')
  str += ' ' + e.desc.padEnd(20, ' ')
  str += ' ' + (e.amount < 0 ? Math.abs(e.amount).toFixed(2).toString() : ' ').padStart(12, ' ')
  str += ' ' + (e.amount >= 0 ? e.amount.toFixed(2).toString() : ' ').padStart(12, ' ')
  return str + '\n'
}

function line(desc, amount) {
  return desc.padEnd(16, ' ') + dollars(amount).padStart(16, ' ') + '\n'
}

function report(worksheet, reconDate) {
  let str = `First Interstate Bank Statement for ${reconDate}\n`
  const tally = reconcile(worksheet, reconDate)
  const beginBal = tally.before.cr.amount - tally.before.dr.amount
  const endBal = beginBal + tally.during.cr.amount - tally.during.dr.amount
  str += line('Previous balance', beginBal)
  str += line(`Credits (${tally.during.cr.n})`, tally.during.cr.amount)
  str += line(`Debits  (${tally.during.dr.n})`, tally.during.dr.amount)
  str += line('Ending balance', endBal)
  str += '\nTransactions:\n'
  tally.trans.forEach(t => { str += entry(t) })
  console.log(str)
}

if (process.argv.length < 4) {
  console.log('Usage: node statement.js <FIB_Checking.xlsx> <YYYMM>')
} else {
  const xlsxFile = process.argv[2]
  const reconDate = parseInt(process.argv[3])

  const workbook = ss.getWorkbook(xlsxFile)
  const worksheet = ss.getWorksheet(workbook, LedgerName)
  report(worksheet, reconDate)
}

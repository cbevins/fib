import XLSX from 'xlsx'

export const TransactionCol = [
  {name: 'transDate', colIdx: 0, default: 0},
  {name: 'transType', colIdx: 1, default: ''},
  {name: 'checkNumb', colIdx: 2, default: 0},
  {name: 'party', colIdx: 3, default: ''},
  {name: 'desc', colIdx: 4, default: ''},
  {name: 'totalAmount', colIdx: 5, default: 0},
  {name: 'totalBalance', colIdx: 6, default: 0},
  {name: 'reconciled', colIdx: 7, default: ''}
]

export function getAccountMeta(worksheet) {
  const lastColIdx = getLastColIdx(worksheet)
  const account = []
  for (let c=8; c<= lastColIdx; c+=2) {
    // Second row has account names in left-most column of amount-balance pairs
    let addr = XLSX.utils.encode_cell({c: c, r: 1})
    const name = worksheet[addr].v
    account.push({name: name, colIdx: c})
  }
  return account
}

export function getCell(worksheet, address) {
  return worksheet[address]
}

export function getIndex(worksheet, rowIdx, colIdx) {
  return getCell(worksheet, XLSX.utils.encode_cell({c: colIdx, r: rowIdx}))
}

export function getLastColIdx(worksheet) {
  return XLSX.utils.decode_range(worksheet['!ref']).e.c
}

export function getLastRowIdx(worksheet) {
  return XLSX.utils.decode_range(worksheet['!ref']).e.r
}

export function getRow(worksheet, lastColIdx, rowIdx) {
  const row = []
  for (let c=0; c<=lastColIdx; c++) {
    row.push(worksheet[XLSX.utils.encode_cell({c: c, r: rowIdx})])
  }
  // \TODO Validate transDate, transType, checkNumb, reconciled
  return row
}

export function getWorkbook (xlsxFile) {
  console.log(`Loading '${xlsxFile}'...`)
  return XLSX.readFile(xlsxFile)
}

export function getWorksheet(workbook, wsName) {
  return workbook.Sheets[wsName]
}

// Returns {s: {c: colIdx, r: rowIdx}, e:{c: colIdx, r: rowIdx}}
export function getWorksheetRange( worksheet) {
  return XLSX.utils.decode_range(worksheet['!ref'])
}

export function logCell(worksheet, addr, note='') {
  console.log(`Cell '${addr}': ${note} =`, worksheet[addr])
}

export function logIndex(worksheet, rowIdx, colIdx, note='') {
  logCell(worksheet, XLSX.utils.encode_cell({c: colIdx, r: rowIdx}), note)
}

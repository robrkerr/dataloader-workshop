const fs = require('fs')
const utils = require('util')

let csvReads = 0

module.exports.readCsvFile = (filename) => (
  new Promise((resolve, reject) => {
    csvReads += 1
    fs.readFile(filename, 'utf8', (err, data) => {
      if (err) {
        reject(err)
      } else {
        const rows = data.split('\n')
        const fields = rows[0].split(',')
        const records = rows.slice(1).map((row) => {
          return fields.reduce((record, field, i) => {
            record[field] = row.split(',')[i]
            return record
          }, {})
        })
        resolve(records)
      }
    })
  })
)

module.exports.deepLog = (obj) => {
  console.log(utils.inspect(obj, false, 10))
}

process.on('exit', () => {
  console.log(`Made ${csvReads} csv read operations`)
})

const chalk = require('chalk')

module.exports = {
  name: "error",
  execute (error) {
    console.log(chalk.red(`An error occurred with the database conneciton: \n${error}`))
  }
}
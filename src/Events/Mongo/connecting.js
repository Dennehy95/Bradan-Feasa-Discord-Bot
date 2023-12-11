const chalk = require('chalk');

module.exports = {
  name: 'connecting',
  execute() {
    console.info(chalk.cyan('[Database Status]: Connecting...'));
  },
};

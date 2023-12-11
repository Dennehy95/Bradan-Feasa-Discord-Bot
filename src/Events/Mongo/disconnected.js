const chalk = require('chalk');

module.exports = {
  name: 'disconnected',
  execute() {
    console.info(chalk.red('[Database Status]: Disconnected.'));
  },
};

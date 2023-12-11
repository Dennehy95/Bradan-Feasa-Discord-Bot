const chalk = require('chalk');

module.exports = {
  name: 'connected',
  execute() {
    console.info(chalk.green('[Database Status]: Connected'));
  },
};

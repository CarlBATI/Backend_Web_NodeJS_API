const { closePool, consoleLogPoolStats } = require('./database/connection');

module.exports = async () => {
    await closePool();
};
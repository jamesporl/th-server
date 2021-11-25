import bunyan from 'bunyan';

const logger = bunyan.createLogger({
  name: 'th-server',
});

export default logger;

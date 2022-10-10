/* API MODULES WITH NODE-JS CLUSTERING */
const Server = require('./classes/class.cluster_master');
const server = new Server();
// /* IF TRUE - CLUSTER ENABLED, FALSE - CLUSTER DISABLED  */
server.start(false);
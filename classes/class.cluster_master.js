const express = require('express');
const cluster = require('cluster');
const CONFIG = require('../common/inc.config');
const standardmiddleware = require('../api/middleware/standard');
const api_router = require('../api/api_router');


const cpu_count = require('os').cpus().length;

class Server {

    constructor() {
        this.epress_apps = [];
        this.workers = [];
    }

    start(clustermode) {
        if (clustermode) {
            this.start_cluster_mode();
        } else {
            this.start_normal_mode();
        }
    }

    start_cluster_mode() {
        if (cluster.isMaster) {
            this.start_master();
        } else {
            this.start_worker();
        }
    }

    start_normal_mode() {
        this.start_worker();
    }

    start_master() {
        //this.logger.info(`Master started in process id [${process.pid}]`);
        console.log(`Master started in process id [${process.pid}]`);
        for (let i = 0; i < cpu_count; i++) {
            let worker = cluster.fork();
            //this.logger.info(`Worker ${worker.id} started started from process id [${process.pid}]`);
            console.log(`Worker ${worker.id} started started from process id [${process.pid}]`)
            worker.on('disconnect', () => {
                //this.logger.info(`Worker ${worker.id} died`);
                console.log(`Worker ${worker.id} died`);
            });
            this.workers.push(worker);
        }
    }

    async start_worker() {
        let app = express();
        /* ATTACHING BODY-PARSER KIND OF MODULES */
        standardmiddleware.attachTo(app);

        /* ROUTING TO API-ROUTER ENDPOINTS */
        app.get('/',function(req,res){res.send('<h1>API ENDPOINT</h1>')});
        app.get('/api',function(req,res){res.send('<h1>API ENDPOINT</h1>')});
        app.use('/api', api_router.create());
        app.use('/debug',require('../debug/app'));
        app.get('*', (req, res) => res.send('Page Not found 404'));
        await this.start_listening(app);
        this.epress_apps.push(app);
    }

    start_listening(app) {
        return new Promise((resolve, reject) => {
            if (CONFIG && CONFIG.API_PORT) {
                let server = app.listen(CONFIG.API_PORT);
                server.on('error', (err) => {
                    //this.logger.info(`Could not start server: ${err}`);
                    console.log(`Could not start server: ${err}`);
                    reject(err);
                });
                server.on('listening', () => {
                    //this.logger.info(`[${process.pid}] Server started on http://localhost:${serverConfig.port}`);
                    console.log(`[${process.pid}] Server started on http://localhost:${CONFIG.API_PORT}`);
                    resolve();
                });
            } else {
                reject(new Error(`serverConfig is not properly defined: ${JSON.stringify(CONFIG)}`));
            }
        });
    }
}

module.exports = Server;
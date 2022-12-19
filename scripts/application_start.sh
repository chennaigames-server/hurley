#!/bin/bash

echo 'run application_start.sh: ' >> /var/www/html/hurley/deploy.log

#echo 'pm2 restart RADDX_API_DEV' >> /var/www/html/raddx_api_dev/deploy.log
#pm2 restart RADDX_API_DEV >> /var/www/html/raddx_api_dev/deploy.log
echo 'Existing Node Stopped' >> /var/www/html/hurley/deploy.log
pkill -9 52600 >> /var/www/html/hurley/deploy.log
echo 'Node Started' >> /var/www/html/hurley/deploy.log
node /var/www/html/hurley/api.js >> /var/www/html/hurley/deploy.log
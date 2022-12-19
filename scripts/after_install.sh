#!/bin/bash
echo 'run after_install.sh: ' >> /var/www/html/raddx_api_dev/deploy.log

echo 'cd /var/www/html/raddx_api_dev' >> /var/www/html/raddx_api_dev/deploy.log
cd /var/www/html/raddx_api_dev >> /var/www/html/raddx_api_dev/deploy.log

echo 'npm install' >> /var/www/html/raddx_api_dev/deploy.log 
npm install >> /var/www/html/raddx_api_dev/deploy.log

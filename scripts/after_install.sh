#!/bin/bash
echo 'run after_install.sh: ' >> /var/www/html/hurley/deploy.log

echo 'cd /var/www/html/hurley' >> /var/www/html/hurley/deploy.log
cd /var/www/html/hurley >> /var/www/html/hurley/deploy.log

echo 'npm install' >> /var/www/html/hurley/deploy.log
npm install >> /var/www/html/hurley/deploy.log

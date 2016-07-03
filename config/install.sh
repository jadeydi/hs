npm install
node_modules/sequelize-cli/bin/sequelize db:migrate
# npm install -g pg
#pm2 start bin/www
pm2 restart bin/www
# rsync -avvur web/public/javascripts/* cksixty:/var/www/repos/hs/web/public/javascripts

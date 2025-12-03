npm ci --production
npm run prod:migrate
npm run prod:build
pm2 restart 2 && pm2 logs 2
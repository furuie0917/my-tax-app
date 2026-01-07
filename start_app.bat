@echo off
echo 税金シミュレーターを起動しています...

:: 1. ブラウザでアプリのページを開く（起動に数秒かかるので先に命令を送る）
start http://localhost:3000

:: 2. アプリを起動する
:: 「npm run dev」を実行します
npm run dev

pause
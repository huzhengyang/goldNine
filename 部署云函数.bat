@echo off
echo ===============================
echo 部署 GitHub 注册云函数
echo ===============================
cd /d "%~dp0"
tcb fn deploy github-register-task --env-id goldnine-hk-8g3g5ijhec9df56e
echo.
echo 按任意键退出...
pause >nul

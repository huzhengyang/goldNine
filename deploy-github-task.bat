@echo off
echo 部署 github-register-task 云函数...
cd /d %~dp0
tcb fn deploy github-register-task --force
echo.
echo 部署完成！
pause

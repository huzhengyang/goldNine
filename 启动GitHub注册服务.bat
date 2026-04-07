@echo off
title GitHub自动注册服务
color 0A
echo.
echo ╔═══════════════════════════════════════════╗
echo ║   GitHub 自动注册服务                    ║
echo ╚═══════════════════════════════════════════╝
echo.
echo 正在启动服务...
echo.
cd /d %~dp0scripts
node poll-service.js
pause

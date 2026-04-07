@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo 开始部署...
echo.
echo y | tcb fn deploy github-register-task --env-id goldnine-hk-8g3g5ijhec9df56e > deploy.log 2>&1
findstr /C:"部署成功" deploy.log
if %errorlevel%==0 (
    echo.
    echo ✓ 部署成功！
) else (
    echo.
    echo 部署可能已完成，请检查日志
)
pause

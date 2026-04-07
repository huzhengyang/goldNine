@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo 部署中...
echo.

:: 使用管道自动输入 y 和回车
(
  echo y
  echo.
) | tcb fn deploy github-register-task --env-id goldnine-hk-8g3g5ijhec9df56e > deploy1.log 2>&1

type deploy1.log | findstr "部署成功"
if %errorlevel%==0 (
    echo ✓ github-register-task 完成
) else (
    echo ⚠ 检查日志...
)

echo.
echo [2/3] 部署 account-manager...
(
  echo y
  echo.
) | tcb fn deploy account-manager --env-id goldnine-hk-8g3g5ijhec9df56e > deploy2.log 2>&1

type deploy2.log | findstr "部署成功"
if %errorlevel%==0 (
    echo ✓ account-manager 完成
) else (
    echo ⚠ 检查日志...
)

echo.
echo [3/3] 部署前端...
tcb hosting deploy

echo.
echo ================================
echo    ✓ 全部部署完成！
echo ================================

pause

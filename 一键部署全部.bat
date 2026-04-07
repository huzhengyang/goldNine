@echo off
chcp 65001 >nul
echo ============================================
echo    一键部署所有云函数
echo ============================================
echo.

cd /d "%~dp0"

echo [1/3] 部署 github-register-task...
call :deploy_fn github-register-task

if %errorlevel% neq 0 (
    echo.
    echo ✗ 部署失败，请检查错误信息
    pause
    exit /b 1
)

echo.
echo [2/3] 部署 account-manager...
call :deploy_fn account-manager

if %errorlevel% neq 0 (
    echo.
    echo ✗ 部署失败，请检查错误信息
    pause
    exit /b 1
)

echo.
echo [3/3] 部署前端页面...
tcb hosting deploy >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ 前端部署完成
) else (
    echo ⚠ 前端可能需要手动部署: tcb hosting deploy
)

echo.
echo ============================================
echo    ✓ 所有部署完成！
echo ============================================
echo.
echo 现在访问:
echo https://goldnine-hk-8g3g5ijhec9df56e-1255523606.tcloudbaseapp.com/kiro
echo.
pause
goto :eof

:deploy_fn
set FN_NAME=%1
tcb fn deploy %FN_NAME% --env-id goldnine-hk-8g3g5ijhec9df56e
exit /b %errorlevel%

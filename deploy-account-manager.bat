@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo 正在部署 account-manager...
echo.

:: 使用 powershell 发送按键来自动化交互
powershell -Command "
  $proc = Start-Process cmd -ArgumentList '/c tcb fn deploy account-manager --env-id goldnine-hk-8g3g5ijhec9df56e' -PassThru -NoNewWindow
  
  Start-Sleep -Seconds 3
  
  # 添加 System.Windows.Forms 程序集
  Add-Type -AssemblyName System.Windows.Forms
  
  # 发送 y (确认覆盖)
  [System.Windows.Forms.SendKeys]::SendWait('y')
  Start-Sleep -Milliseconds 500
  [System.Windows.Forms.SendKeys]::SendWait('{ENTER}')
  
  Start-Sleep -Seconds 2
  
  # 发送 Enter (选择默认选项)
  [System.Windows.Forms.SendKeys]::SendWait('{ENTER}')
  
  Write-Host '命令已发送，等待完成...'
  
  $proc.WaitForExit()
  Write-Host '退出码:' $proc.ExitCode
"

echo.
echo 部署完成！
pause

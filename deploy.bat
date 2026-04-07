$ErrorActionPreference = "SilentlyContinue"
$shell = New-Object -ComObject WScript.Shell

# 启动部署命令
$env:Path += ";C:\Users\Administrator\AppData\Roaming\npm"
$cmd = "tcb fn deploy github-register-task --env-id goldnine-hk-8g3g5ijhec9df56e"

# 等待窗口出现并发送按键
Start-Sleep -Seconds 2
$shell.SendKeys("y")
Start-Sleep -Milliseconds 500
$shell.SendKeys("{ENTER}")
Start-Sleep -Seconds 15
$shell.SendKeys("{ENTER}")

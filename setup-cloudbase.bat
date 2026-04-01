@echo off
chcp 65001 >nul
cls

echo =====================================
echo   GoldNine CloudBase 配置向导
echo =====================================
echo.

REM 检查 .env.local 是否存在
if not exist ".env.local" (
    echo ❌ .env.local 文件不存在
    echo.
    echo 请先创建 .env.local 文件：
    echo.
    echo NEXT_PUBLIC_CLOUDBASE_ENV_ID=your-env-id-here ^> .env.local
    echo.
    echo 然后编辑 .env.local 文件，填入你的环境ID
    echo.
    pause
    exit /b 1
)

REM 读取环境ID
for /f "tokens=2 delims==" %%a in ('findstr /i "NEXT_PUBLIC_CLOUDBASE_ENV_ID" .env.local') do (
    set ENV_ID=%%a
)

if "%ENV_ID%"=="your-env-id-here" (
    echo ⚠️  环境ID未配置
    echo.
    echo 请按以下步骤配置：
    echo 1. 访问 https://tcb.cloud.tencent.com/dev
    echo 2. 创建或选择环境
    echo 3. 复制环境ID
    echo 4. 粘贴到 .env.local 文件中
    echo.
    pause
    exit /b 1
)

echo ✅ 环境ID已配置
echo    环境ID: %ENV_ID%
echo.

echo =====================================
echo   CloudBase 配置清单
echo =====================================
echo.

echo 请按顺序完成以下配置：
echo.
echo 1️⃣  配置认证服务
echo    - 访问: https://tcb.cloud.tencent.com/dev?envId=%ENV_ID%#/identity
echo    - 启用: 手机号验证码登录
echo    - 启用: 微信授权登录（可选）
echo    - 启用: 匿名登录（可选）
echo.

echo 2️⃣  配置数据库
echo    - 访问: https://tcb.cloud.tencent.com/dev?envId=%ENV_ID%#/db/doc
echo    - 创建: 12个集合（参考 数据库设计.md）
echo    - 创建: 所有索引
echo    - 配置: 安全规则
echo.

echo 3️⃣  配置 AI 服务
echo    - 访问: https://tcb.cloud.tencent.com/dev?envId=%ENV_ID%#/ai
echo    - 启用: 混元 AI
echo    - 启用: AI 视觉分析
echo.

echo 4️⃣  配置云存储
echo    - 访问: https://tcb.cloud.tencent.com/dev?envId=%ENV_ID%#/storage
echo    - 创建: 文件夹（avatars, news, venues, coaches, videos）
echo    - 配置: 存储权限
echo.

echo 5️⃣  部署云函数
echo    - 运行: npx @cloudbase/cli functions:deploy
echo    - 测试: 在控制台测试云函数
echo.

echo 6️⃣  配置静态托管
echo    - 访问: https://tcb.cloud.tencent.com/dev?envId=%ENV_ID%#/static-hosting
echo    - 开通: 静态网站托管
echo.

echo 7️⃣  部署网站
echo    - 运行: npm run build
echo    - 运行: npx @cloudbase/cli hosting:deploy
echo.

echo.
echo =====================================
echo   快速链接
echo =====================================
echo.

echo 控制台首页:
echo https://tcb.cloud.tencent.com/dev?envId=%ENV_ID%
echo.

echo 数据库:
echo https://tcb.cloud.tencent.com/dev?envId=%ENV_ID%#/db/doc
echo.

echo 云函数:
echo https://tcb.cloud.tencent.com/dev?envId=%ENV_ID%#/scf
echo.

echo 云存储:
echo https://tcb.cloud.tencent.com/dev?envId=%ENV_ID%#/storage
echo.

echo AI服务:
echo https://tcb.cloud.tencent.com/dev?envId=%ENV_ID%#/ai
echo.

echo.
echo =====================================
echo   配置完成后，运行以下命令启动项目：
echo =====================================
echo.
echo npm run dev
echo.

pause

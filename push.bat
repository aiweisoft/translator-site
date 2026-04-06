@echo off
echo ========================================
echo   翻译网站自动推送脚本
echo   Auto Push to GitHub
echo ========================================
echo.

cd /d "%~dp0"

git add -A

git diff --cached --quiet
if %errorlevel% equ 0 (
    echo 没有需要提交的更改。
    echo No changes to commit.
    pause
    exit /b 0
)

echo 请输入提交信息 (直接回车使用默认信息):
set /p commit_msg=
if "%commit_msg%"=="" (
    set commit_msg=update: auto commit at %date% %time%
)

git commit -m "%commit_msg%"
git push origin main

echo.
echo ========================================
echo   推送完成！Push successful!
echo ========================================
pause

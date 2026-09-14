@echo off
title ProHabit Launcher
echo Dang khoi dong ProHabit Desktop App...
start "" "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" --app="file:///%~dp0index.html"
exit

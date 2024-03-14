@echo off

if [%1]==[] goto usage
if [%2]==[] goto usage

SET "name=%~2.png"
adb "devices"
adb "-s" "%1" "shell" "screencap" "-p" "/sdcard/%name%"
adb "-s" "%1" "pull" "/sdcard/%name%"
adb "-s" "%1" "shell" "rm" "/sdcard/%name%"
@echo %name%
@echo %1%

goto :eof
:usage
@echo Usage: %0 ^<deviceName^> ^<FileName^>
exit /B 1
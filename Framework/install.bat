FOR /f "tokens=1,2 delims==" %%I IN (variables.txt) DO (
	SET %%I=%%J
)

START "Vultr" "C:\Program Files\PuTTY\putty.exe" %USERNAME%@%IP% ^
-P %PORT% ^
-pw %PASSWORD% ^
-m install.txt

EXIT
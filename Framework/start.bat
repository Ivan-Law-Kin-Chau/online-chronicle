FOR /f "tokens=1,2 delims==" %%I IN (variables.txt) DO (
	SET %%I=%%J
)

START "Vultr" "C:\Program Files\PuTTY\putty.exe" %USERNAME%@%IP% ^
-P %PORT% ^
-pw %PASSWORD% ^
-m start.txt

TIMEOUT \t 10

START "Localtunnel" lt ^
--host http://chronicle.ga ^
--port 8000 ^
--subdomain online

EXIT
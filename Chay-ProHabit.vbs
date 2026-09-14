Set WshShell = CreateObject("WScript.Shell")
htmlPath = Replace(WScript.ScriptFullName, WScript.ScriptName, "") & "index.html"
edgeCmd = """C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"" --app=""file:///" & htmlPath & """"
WshShell.Run edgeCmd, 0, False

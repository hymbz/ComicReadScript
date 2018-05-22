#  -*- coding: utf-8 -*-
import pyperclip
import winsound
import re
content=pyperclip.paste()

with open('YamiboScript.js', 'r', encoding="utf-8") as f:
    mainStr = f.read()

for fileName in re.findall(r"(?<=@@).+?(?=@@)", mainStr):
    if fileName.split('.')[1] == "css":
        with open(fileName, 'r', encoding="utf-8") as f:
            mainStr = mainStr.replace(f"@@{fileName}@@",f.read())
    elif fileName.split('.')[1] == "html":
        with open(fileName, 'r', encoding="utf-8") as f:
            mainStr = mainStr.replace(f"@@{fileName}@@",f.read().replace("  ","").replace("\n",""))


pyperclip.copy(mainStr)
winsound.Beep(600, 600)

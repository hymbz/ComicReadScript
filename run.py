#  -*- coding: utf-8 -*-
import pyperclip
import winsound
import sys
import re
import os
content=pyperclip.paste()


for file in list(filter(lambda x: 'Raw.js' in x, os.listdir(sys.argv[1]))):
  with open(f"{sys.argv[1]}\\{file}", 'r', encoding="utf-8") as f:
    mainStr = f.read()

  for fileName in re.findall(r"(?<=@@).+?(?=@@)", mainStr):
    if fileName.split('.')[1] == "css":
      with open(f"{sys.argv[1]}\\{fileName}", 'r', encoding="utf-8") as f:
        mainStr = mainStr.replace(f"@@{fileName}@@",f.read())
    elif fileName.split('.')[1] == "html":
      with open(f"{sys.argv[1]}\\{fileName}", 'r', encoding="utf-8") as f:
        mainStr = mainStr.replace(f"@@{fileName}@@",f.read().replace("  ","").replace("\n",""))


  with open(f"{sys.argv[1]}\\{file.split('Raw.js')[0]}.user.js", 'w', encoding="utf-8") as f:
    f.write(mainStr)

pyperclip.copy(mainStr)
winsound.Beep(600, 600)

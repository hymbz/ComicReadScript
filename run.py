#  -*- coding: utf-8 -*-

"""用来把 css、html 文件压缩成一行后放进脚本里，并把处理后的脚本放进剪贴板"""

import pyperclip
import winsound
import sys
import re
import os

for root, dirs, files in os.walk(sys.argv[1]):
  for file in files:
    if('Raw.js' in file):
      print(os.path.join(root,file))
      with open(os.path.join(root,file), 'r', encoding="utf-8") as f:
        mainStr = f.read()

      for fileName in re.findall(r"(?<=@@).+?(?=@@)", mainStr):
        if fileName.split('.')[1] == "css":
          with open(os.path.join(root,fileName), 'r', encoding="utf-8") as f:
            mainStr = mainStr.replace(f"@@{fileName}@@",f.read())
        elif fileName.split('.')[1] == "html":
          with open(os.path.join(root,fileName), 'r', encoding="utf-8") as f:
            mainStr = mainStr.replace(f"@@{fileName}@@",f.read().replace("  ","").replace("\n",""))

      with open(os.path.join(root,f'{file.split("Raw.js")[0]}.user.js'), 'w', encoding="utf-8") as f:
        f.write(mainStr)

pyperclip.copy(mainStr)
winsound.Beep(600, 600)

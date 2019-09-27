#  -*- coding: utf-8 -*-

"""简易的模板，把 RAW 结尾的文件中的用 @@ 包围起来的模板字符串转为对应内容"""

import pyperclip
import winsound
import sys
import re
import os

siteScript = {}

for root, dirs, files in os.walk(sys.argv[1], topdown=False):
  for file in files:
    # 只遍历子目录和非 . 开头的文件夹
    if(r'\.' not in root):
      if('Raw.js' in file):
        with open(os.path.join(root, file), 'r', encoding="utf-8") as f:
          mainStr = f.read()

        for fileName in re.findall(r"@@(.+?)@@", mainStr):
          # css 直接替换
          if fileName.split('.')[1] == "css":
            with open(os.path.join(root, fileName), 'r', encoding="utf-8") as f:
              mainStr = mainStr.replace(f"@@{fileName}@@", re.sub(r'\n','',f.read()))
          # html 会将 ' 换成 ` ，以防止引号问题
          elif fileName.split('.')[1] == "html":
            with open(os.path.join(root, fileName), 'r', encoding="utf-8") as f:
              mainStr = mainStr.replace(f"'@@{fileName}@@'", '`' + re.sub(r'  |\n','',f.read()) + '`')
          # 引用外部脚本
          elif fileName.split('.')[1] == "js":
            with open(os.path.join(sys.argv[1], 'externalScripts', fileName), 'r', encoding="utf-8") as f:
              mainStr = mainStr.replace(f"'@@{fileName}@@'", f.read())
          # 模块格式为 '@@{fileName}@@';
          else:
            mainStr = mainStr.replace(f"'@@{fileName}@@'", f'\n\n\n{siteScript[fileName[:-1]]}\n\n')

        siteScript[file[:-6]] = mainStr

with open('ComicRead.user.js', 'w', encoding="utf-8") as f:
  f.write(mainStr)
pyperclip.copy(mainStr)
winsound.Beep(600, 600)

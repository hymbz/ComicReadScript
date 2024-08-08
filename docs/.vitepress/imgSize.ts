import fs from "node:fs";
import fetch from "sync-fetch";
import { imageMeta } from "image-meta";
import { MarkdownRenderer } from "vitepress";

const getImg = (url: string) => {
  if (url.startsWith("https://comic-read-docs.pages.dev/")) {
    const name = decodeURI(url.split("https://comic-read-docs.pages.dev/")[1]);
    return fs.readFileSync(`docs/public/${name}`);
  }

  if (url.startsWith("http")) {
    const res = fetch(url);
    return res.buffer();
  }

  return fs.readFileSync(url);
};

export const imgSize: Parameters<MarkdownRenderer['use']>[0] = (md) => {
  const defaultImageRenderer = md.renderer.rules.image!;

  md.renderer.rules.image = function (tokens, idx, options, env, self) {
    const token = tokens[idx];
    token.attrSet("loading", "lazy");

    try {
      const imgData = getImg(token.attrGet("src")!);
      const { width, height } = imageMeta(imgData);
      if (width) token.attrSet("width", `${width}px`);
      if (height) token.attrSet("height", `${height}px`);
    } catch (error) {
      debugger;
      console.error(error);
    }

    return defaultImageRenderer(tokens, idx, options, env, self);
  };
};

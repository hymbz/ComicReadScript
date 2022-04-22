/* eslint-disable @typescript-eslint/no-unsafe-return */
import raxios from 'axios';
import type { AxiosAdapter } from 'axios';
import axiosGmxhrAdapter from 'axios-userscript-adapter';

export const axios = raxios.create({
  adapter: axiosGmxhrAdapter as AxiosAdapter,
  timeout: 10 * 1000,
});

/**
 * 对 document.querySelector 的封装
 * 将默认返回类型改为 HTMLElement
 *
 * @param selector *
 * @returns *
 */
export const querySelector = <T extends HTMLElement = HTMLElement>(
  selector: string,
) => document.querySelector<T>(selector);

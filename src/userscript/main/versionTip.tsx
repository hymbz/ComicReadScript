import { type JSX, type ParentComponent, Show } from 'solid-js';

/** 判断版本号1是否小于版本号2 */
const versionLt = (version1: string, version2: string) => {
  const v1 = version1.split('.').map(Number);
  const v2 = version2.split('.').map(Number);

  for (let i = 0; i < 3; i++) {
    const num1 = v1[i] ?? 0;
    const num2 = v2[i] ?? 0;
    if (num1 !== num2) return num1 < num2;
  }

  return false;
};

interface VersionTipProps {
  v1: string;
  v2: string;
  children: JSX.Element;
}

/** 在版本号1小于版本号2时显示提示。确保从旧版本跳级上来的用户不会错过 */
export const VersionTip: ParentComponent<VersionTipProps> = (props) => (
  // 确保从旧版本直接更新上来的用户可以看到改动提示
  <Show when={versionLt(props.v1, props.v2)} children={props.children} />
);

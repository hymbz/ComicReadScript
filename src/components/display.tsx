/*
 * 用于测试时显示组件
 */

import { For, Suspense, lazy } from 'solid-js';
import { render } from 'solid-js/web';
import { Route, A, Router } from '@solidjs/router';

import 'normalize.css';

const modules = import.meta.glob('./**/display.tsx');

const root = document.getElementById('root');
render(
  () => (
    <Router>
      <Route
        path="/"
        component={() => (
          // 首页列表
          <nav
            style={{
              'border-bottom': 'solid 1px',
              'padding-bottom': '1rem',
            }}
          >
            <For each={Object.keys(modules)}>
              {(path) => {
                const name = path.split('/').at(-2);
                return (
                  <>
                    <A href={`/${name}`}>{name}</A>
                    <br />
                  </>
                );
              }}
            </For>
          </nav>
        )}
      />
      <For each={Object.entries(modules)}>
        {([path, Fc]) => {
          const Component = lazy(Fc as any);
          return (
            <Route
              path={path.split('/').at(-2)}
              component={() => (
                <Suspense fallback={null}>
                  <Component />
                </Suspense>
              )}
            />
          );
        }}
      </For>
    </Router>
  ),
  root!,
);

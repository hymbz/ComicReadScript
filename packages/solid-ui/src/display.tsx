/* eslint-disable import/no-extraneous-dependencies */
/*
 * 用于测试时显示组件
 */

import { For, Suspense, lazy } from 'solid-js';
import { render } from 'solid-js/web';
import { Routes, Route, A, Router } from '@solidjs/router';

// eslint-disable-next-line import/no-extraneous-dependencies
import 'normalize.css';

const modules = import.meta.glob('./containers/**/display.tsx');

const root = document.getElementById('root');
render(
  () => (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            // 首页列表
            <nav
              style={{
                'border-bottom': 'solid 1px',
                'padding-bottom': '1rem',
              }}
            >
              <For each={Object.keys(modules)}>
                {(path) => {
                  const name = path.split('/')[2];
                  return (
                    <>
                      <A href={`/${name}`}>{name}</A>
                      <br />
                    </>
                  );
                }}
              </For>
            </nav>
          }
        />
        <For each={Object.entries(modules)}>
          {([path, Fc]) => {
            const Component = lazy(Fc as any);
            return (
              <Route
                path={path.split('/')[2]}
                element={
                  <Suspense fallback={null}>
                    <Component />
                  </Suspense>
                }
              />
            );
          }}
        </For>
      </Routes>
    </Router>
  ),
  root!,
);

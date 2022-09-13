/* eslint-disable import/no-extraneous-dependencies */
/*
 * 用于测试时显示组件
 */

import { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';

const modules = import.meta.glob('./containers/**/display.tsx');

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <BrowserRouter>
    <Routes>
      <Route
        path="/"
        element={
          // 首页列表
          <nav
            style={{
              borderBottom: 'solid 1px',
              paddingBottom: '1rem',
            }}
          >
            {Object.keys(modules).map((path) => {
              const name = path.split('/')[2];
              return (
                <Link key={path} to={`/${name}`}>
                  {name}
                </Link>
              );
            })}
          </nav>
        }
      />

      {Object.entries(modules).map(([path, Fc]) => {
        const Component = lazy(Fc as any);
        return (
          <Route
            key={path}
            path={path.split('/')[2]}
            element={
              <Suspense fallback={null}>
                <Component />
              </Suspense>
            }
          />
        );
      })}
    </Routes>
  </BrowserRouter>,
);

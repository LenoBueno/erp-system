import dynamic from 'next/dynamic';

export const lazyLoad = (importPath: string, options: { ssr?: boolean } = {}) => {
  return dynamic(() => import(importPath), options);
};

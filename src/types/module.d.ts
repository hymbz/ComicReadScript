declare module '*.svg' {
  const fc: import('solid-js').Component<
    import('solid-js').JSX.HTMLAttributes<HTMLElement>
  >;
  export default fc;
}

declare module '*.md' {
  const md: {
    html: string;
  };
  export default md;
}

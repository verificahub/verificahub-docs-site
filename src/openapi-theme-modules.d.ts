// Ambient declarations for the docusaurus-theme-openapi-docs sub-components we
// import in the swizzled ApiExplorer. These resolve via the `@theme` alias at
// build time, but tsc needs the module shapes declared. Kept as a global
// (no top-level import) so the `declare module` blocks register ambiently.
declare module '@theme/ApiExplorer/CodeSnippets' {
  const CodeSnippets: import('react').ComponentType<any>;
  export default CodeSnippets;
}

declare module '@theme/ApiExplorer/SecuritySchemes' {
  const SecuritySchemes: import('react').ComponentType<{infoPath: string}>;
  export default SecuritySchemes;
}

declare module '@theme/ApiItem/hooks' {
  export const useTypedDispatch: () => (action: unknown) => void;
  export const useTypedSelector: <T>(selector: (state: any) => T) => T;
}

declare module '@theme/ApiExplorer/Server/slice' {
  export const setServer: (payload: string) => unknown;
}

declare module '@theme/CodeBlock' {
  const CodeBlock: import('react').ComponentType<{
    language?: string;
    title?: string;
    showLineNumbers?: boolean;
    className?: string;
    children: import('react').ReactNode;
  }>;
  export default CodeBlock;
}

declare namespace React {
  interface FunctionComponent<P = {}> {
    (props: P, context?: any): any;
    propTypes?: any;
    contextTypes?: any;
    defaultProps?: Partial<P>;
    displayName?: string;
  }
  
  interface ComponentClass<P = {}, S = {}> {
    new (props: P, context?: any): any;
    propTypes?: any;
    contextTypes?: any;
    defaultProps?: Partial<P>;
    displayName?: string;
  }
  
  type ComponentType<P = {}> = ComponentClass<P> | FunctionComponent<P>;
  
  interface ReactNode {}
  
  function createElement(
    type: string | ComponentType<any>,
    props?: any,
    ...children: ReactNode[]
  ): ReactNode;
}

declare module 'react' {
  export = React;
  export as namespace React;
}

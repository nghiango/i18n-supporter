export type IBuilder<T> = {
  [k in keyof T]: (arg: T[k]) => IBuilder<T>
} & { build(): T };

type Clazz<T> = new(...args: any[]) => T;

export function Builder<T>(template?: Clazz<T>): IBuilder<T> {
  const built: any = {};
  const builder = new Proxy({}, {
    get: function(target, prop, receiver) {
      if (prop === 'build') { return () => built; }
      return (x: any): any => {
        (built[prop] = x);
        return builder;
      };
    }
  });
  return builder as any;
}

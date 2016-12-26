import { IocContainer, INewable } from './IocContainer';

export const iocContainer = new IocContainer();

export function inject(type: INewable<any>) {
  return (target: any, key: string) => {
    function getter() {
      return iocContainer.get(type);
    }

    Object.defineProperty(target, key, {
      configurable: true,
      enumerable: true,
      get: getter,
    });
  };
}

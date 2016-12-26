export interface INewable<T> {
  new (...args: any[]): T;
}

export class IocContainer {
  private singletons: INewable<any>[];
  private instances: Map<INewable<any>, any>;
  private snapshots: Map<INewable<any>, any>[];

  constructor() {
    this.singletons = [];
    this.instances = new Map<INewable<any>, any>();
    this.snapshots = [];
  }

  registerSingleton<T>(newable: INewable<T>) {
    this.singletons.push(newable);
  }

  get<T>(type: INewable<T>): T {
    return this.instances.get(type) || this.createInstance(type);
  }

  snapshot() {
    const copy = new Map<INewable<any>, any>();
    for (let [key, value] of this.instances) {
      copy.set(key, value);
    }

    this.snapshots.push(copy);
  }

  restore() {
    const latest = this.snapshots.pop();
    if (!latest) {
      return;
    }

    this.instances = latest;
  }

  private createInstance<T>(type: INewable<T>): T {
    const instance = new type();
    this.instances.set(type, instance);
    return instance;
  }
}

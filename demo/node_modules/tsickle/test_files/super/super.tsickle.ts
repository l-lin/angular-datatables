class SuperTestBaseNoArg {
/**
 */
constructor() {}
}

class SuperTestBaseOneArg {
/**
 * @param {number} x
 */
constructor(public x: number) {}

  static _tsickle_typeAnnotationsHelper() {
 /** @type {number} */
SuperTestBaseOneArg.prototype.x;
  }

}

// A ctor with a parameter property.
class SuperTestDerivedParamProps extends SuperTestBaseOneArg {
/**
 * @param {string} y
 */
constructor(public y: string) {
    super(3);
  }

  static _tsickle_typeAnnotationsHelper() {
 /** @type {string} */
SuperTestDerivedParamProps.prototype.y;
  }

}

// A ctor with an initialized property.
class SuperTestDerivedInitializedProps extends SuperTestBaseOneArg {
  y: string = 'foo';
/**
 */
constructor() {
    super(3);
  }

  static _tsickle_typeAnnotationsHelper() {
 /** @type {string} */
SuperTestDerivedInitializedProps.prototype.y;
  }

}

// A ctor with a super() but none of the above two details.
class SuperTestDerivedOrdinary extends SuperTestBaseOneArg {
/**
 */
constructor() {
    super(3);
  }
}

// A class without a ctor, extending a one-arg ctor parent.
class SuperTestDerivedNoCTorNoArg extends SuperTestBaseNoArg {
}

// A class without a ctor, extending a no-arg ctor parent.
class SuperTestDerivedNoCTorOneArg extends SuperTestBaseOneArg {
  // NOTE: if this has any properties, we fail to generate it
  // properly because we generate a constructor that doesn't know
  // how to properly call the parent class's super().
}
/** @record */
function SuperTestInterface() {}
 /** @type {number} */
SuperTestInterface.prototype.foo;


interface SuperTestInterface {
  foo: number;
}

// A class implementing an interface.
class SuperTestDerivedInterface implements SuperTestInterface {
  foo: number;

  static _tsickle_typeAnnotationsHelper() {
 /** @type {number} */
SuperTestDerivedInterface.prototype.foo;
  }

}

class SuperTestStaticProp extends SuperTestBaseOneArg {
  static foo = 3;

  static _tsickle_typeAnnotationsHelper() {
 /** @type {number} */
SuperTestStaticProp.foo;
  }

}

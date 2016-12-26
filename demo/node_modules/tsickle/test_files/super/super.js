goog.module('test_files.super.super');var module = module || {id: 'test_files/super/super.js'};class SuperTestBaseNoArg {
    /**
     */
    constructor() {
    }
}
class SuperTestBaseOneArg {
    /**
     * @param {number} x
     */
    constructor(x) {
        this.x = x;
    }
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
    constructor(y) {
        super(3);
        this.y = y;
    }
    static _tsickle_typeAnnotationsHelper() {
        /** @type {string} */
        SuperTestDerivedParamProps.prototype.y;
    }
}
// A ctor with an initialized property.
class SuperTestDerivedInitializedProps extends SuperTestBaseOneArg {
    /**
     */
    constructor() {
        super(3);
        this.y = 'foo';
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
}
/** @record */
function SuperTestInterface() { }
/** @type {number} */
SuperTestInterface.prototype.foo;
// A class implementing an interface.
class SuperTestDerivedInterface {
    static _tsickle_typeAnnotationsHelper() {
        /** @type {number} */
        SuperTestDerivedInterface.prototype.foo;
    }
}
class SuperTestStaticProp extends SuperTestBaseOneArg {
    static _tsickle_typeAnnotationsHelper() {
        /** @type {number} */
        SuperTestStaticProp.foo;
    }
}
SuperTestStaticProp.foo = 3;

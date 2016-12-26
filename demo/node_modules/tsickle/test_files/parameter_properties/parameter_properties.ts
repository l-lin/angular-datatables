class ParamProps {
  // The @export below should not show up in the output ctor.
  constructor(/** @export */ public bar: string,
    /* foo */ public bar2: string) {}
}

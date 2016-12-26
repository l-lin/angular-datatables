function decorator(a: Object, b: string) {}

/** @Annotation */
function annotationDecorator(a: Object, b: string) {}

class DecoratorTest {
  @decorator
  private x: number;

  
  private y: number;
static propDecorators: {[key: string]: DecoratorInvocation[]} = {
'y': [{ type: annotationDecorator },],
};
}

interface DecoratorInvocation {
  type: Function;
  args?: any[];
}

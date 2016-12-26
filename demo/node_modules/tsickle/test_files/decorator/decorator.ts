function decorator(a: Object, b: string) {}

/** @Annotation */
function annotationDecorator(a: Object, b: string) {}

class DecoratorTest {
  @decorator
  private x: number;

  @annotationDecorator
  private y: number;
}

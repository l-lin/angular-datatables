/**
 * TypeScript has an API for JSDoc already, but it's not exposed.
 * https://github.com/Microsoft/TypeScript/issues/7393
 * For now we create types that are similar to theirs so that migrating
 * to their API will be easier.  See e.g. ts.JSDocTag and ts.JSDocComment.
 */
export interface Tag {
  // tagName is e.g. "param" in an @param declaration.  It's absent
  // for the plain text documentation that occurs before any @foo lines.
  tagName?: string;
  // parameterName is the the name of the function parameter, e.g. "foo"
  // in
  //   @param foo The foo param.
  parameterName?: string;
  type?: string;
  // optional is true for optional function parameters.
  optional?: boolean;
  // restParam is true for "...x: foo[]" function parameters.
  restParam?: boolean;
  // destructuring is true for destructuring bind parameters, which require
  // non-null arguments on the Closure side.  Can likely remove this
  // once TypeScript nullable types are available.
  destructuring?: boolean;
  text?: string;
}

function arrayIncludes<T>(array: T[], key: T): boolean {
  for (const elem of array) {
    if (elem === key) return true;
  }
  return false;
}

/**
 * A list of all JSDoc tags allowed by the Closure compiler.
 * The public Closure docs don't list all the tags it allows; this list comes
 * from the compiler source itself.
 * https://github.com/google/closure-compiler/blob/master/src/com/google/javascript/jscomp/parsing/Annotation.java
 */
const JSDOC_TAGS_WHITELIST = [
  'ngInject',
  'abstract',
  'argument',
  'author',
  'consistentIdGenerator',
  'const',
  'constant',
  'constructor',
  'copyright',
  'define',
  'deprecated',
  'desc',
  'dict',
  'disposes',
  'enum',
  'export',
  'expose',
  'extends',
  'externs',
  'fileoverview',
  'final',
  'hidden',
  'idGenerator',
  'implements',
  'implicitCast',
  'inheritDoc',
  'interface',
  'record',
  'jaggerInject',
  'jaggerModule',
  'jaggerProvidePromise',
  'jaggerProvide',
  'lends',
  'license',
  'meaning',
  'modifies',
  'noalias',
  'nocollapse',
  'nocompile',
  'nosideeffects',
  'override',
  'owner',
  'package',
  'param',
  'polymerBehavior',
  'preserve',
  'preserveTry',
  'private',
  'protected',
  'public',
  'return',
  'returns',
  'see',
  'stableIdGenerator',
  'struct',
  'suppress',
  'template',
  'this',
  'throws',
  'type',
  'typedef',
  'unrestricted',
  'version',
  'wizaction',
];

/**
 * A list of JSDoc @tags that are never allowed in TypeScript source.
 * These are Closure tags that can be expressed in the TypeScript surface
 * syntax.
 */
const JSDOC_TAGS_BLACKLIST = ['private', 'public', 'type'];

/** A list of JSDoc @tags that might include a {type} after them. */
const JSDOC_TAGS_WITH_TYPES = ['export', 'param', 'return'];

/**
 * parse parses JSDoc out of a comment string.
 * Returns null if comment is not JSDoc.
 */
export function parse(comment: string): {tags: Tag[], warnings?: string[]}|null {
  // TODO(evanm): this is a pile of hacky regexes for now, because we
  // would rather use the better TypeScript implementation of JSDoc
  // parsing.  https://github.com/Microsoft/TypeScript/issues/7393
  let match = comment.match(/^\/\*\*([\s\S]*?)\*\/$/);
  if (!match) return null;
  comment = match[1].trim();
  // Strip all the " * " bits from the front of each line.
  comment = comment.replace(/^\s*\* /gm, '');
  let lines = comment.split('\n');
  let tags: Tag[] = [];
  let warnings: string[] = [];
  for (let line of lines) {
    match = line.match(/^@(\S+) *(.*)/);
    if (match) {
      let [_, tagName, text] = match;
      if (tagName === 'returns') {
        // A synonym for 'return'.
        tagName = 'return';
      }
      if (arrayIncludes(JSDOC_TAGS_BLACKLIST, tagName)) {
        warnings.push(`@${tagName} annotations are redundant with TypeScript equivalents`);
        continue;  // Drop the tag so Closure won't process it.
      } else if (arrayIncludes(JSDOC_TAGS_WITH_TYPES, tagName) && text[0] === '{') {
        warnings.push('type annotations (using {...}) are redundant with TypeScript types');
        continue;
      } else if (!arrayIncludes(JSDOC_TAGS_WHITELIST, tagName)) {
        // Silently drop tags we don't understand.  This is a subtle
        // compromise between multiple issues.
        // 1) If we pass through these non-Closure tags, the user will
        //    get a warning from Closure, and the point of tsickle is
        //    to insulate the user from Closure.
        // 2) The output of tsickle is for Closure only, so we don't
        //    care if we drop tags that Closure doesn't undersand.
        // 3) Finally, we don't want to warn because users should be
        //    free to add whichever JSDoc they feel like.  If the user
        //    wants help ensuring they didn't typo a tag, that is the
        //    responsibility of a linter.
        continue;
      }

      // Grab the parameter name from @param tags.
      let parameterName: string|undefined;
      if (tagName === 'param') {
        match = text.match(/^(\S+) ?(.*)/);
        if (match) [_, parameterName, text] = match;
      }

      let tag: Tag = {tagName};
      if (parameterName) tag.parameterName = parameterName;
      if (text) tag.text = text;
      tags.push(tag);
    } else {
      // Text without a preceding @tag on it is either the plain text
      // documentation or a continuation of a previous tag.
      if (tags.length === 0) {
        tags.push({text: line.trim()});
      } else {
        tags[tags.length - 1].text += ' ' + line.trim();
      }
    }
  }
  if (warnings.length > 0) {
    return {tags, warnings};
  }
  return {tags};
}

/** Serializes a Comment out to a string usable in source code. */
export function toString(tags: Tag[]): string {
  let out = '';
  out += '/**\n';
  for (let tag of tags) {
    out += ' * ';
    if (tag.tagName) {
      out += `@${tag.tagName}`;
    }
    if (tag.type) {
      out += ' {';
      if (tag.restParam) {
        out += '...';
      }
      out += tag.type;
      if (tag.optional) {
        out += '=';
      }
      out += '}';
    }
    if (tag.parameterName) {
      out += ' ' + tag.parameterName;
    }
    if (tag.text) {
      out += ' ' + tag.text;
    }
    out += '\n';
  }
  out += ' */\n';
  return out;
}

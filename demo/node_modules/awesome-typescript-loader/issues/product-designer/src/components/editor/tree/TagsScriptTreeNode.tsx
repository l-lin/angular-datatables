import * as React from 'react';

import { TreeNode } from './TreeNode';

export class TagsScriptTreeNode extends TreeNode {
  render() {
    return (
      <div className="item">
        <div className="click-overlay" />
        <i className="icon" />
        <i className="tags icon" />
        <div className="content">
          <div className="description">Tags script</div>
        </div>
      </div>
    );
  }
}

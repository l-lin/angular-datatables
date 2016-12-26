import * as React from 'react';

import { TreeNode } from './TreeNode';

export class RulesScriptTreeNode extends TreeNode {
  render() {
    return (
      <div className="item">
        <div className="click-overlay" />
        <i className="icon" />
        <i className="ban icon" />
        <div className="content">
          <div className="description">Rules script</div>
        </div>
      </div>
    );
  }
}

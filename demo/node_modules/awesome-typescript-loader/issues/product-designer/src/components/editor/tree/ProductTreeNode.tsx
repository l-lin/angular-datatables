import * as React from 'react';

import { TreeNode } from './TreeNode';
import { RulesScriptTreeNode } from './RulesScriptTreeNode';
import { TagsScriptTreeNode } from './TagsScriptTreeNode';

export class ProductTreeNode extends TreeNode {
  render() {
    return (
      <div className="item">
        <div className="click-overlay" />
        <i className="icon" />
        <i className="cube icon" />
        <div className="content">
          <div className="description">foo</div>
          <div className="ui list">
            <RulesScriptTreeNode />
            <TagsScriptTreeNode />
          </div>
        </div>
      </div>
    );
  }
}

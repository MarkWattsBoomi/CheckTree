import React from "react";
import CheckTree from "./CheckTree";
import { CheckTreeNodeElement } from "./CheckTreeNodeElement";


export default class CheckTreeNode extends React.Component<any,any> {

    constructor(props: any) {
        super(props);
        this.state = {expanded: false}
    }

    componentDidMount(): void {
        
    }

    render() {
        let tree: CheckTree = this.props.tree;
        let node: CheckTreeNodeElement = tree.tree.getNode(this.props.internalId);
        let nodes: any[] = [];
        
        node?.children?.forEach((node: CheckTreeNodeElement) =>{
            nodes.push(
                <CheckTreeNode 
                    tree = {this.props.tree}
                    parent = {this}
                    internalId = {node.internalId}
                />
            );
        });
        return(
            <div>
            <span>
                {node?.internalId}
            </span>
            {nodes}
            </div>
        )
    }
}
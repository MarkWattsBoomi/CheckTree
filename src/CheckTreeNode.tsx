import React, { CSSProperties } from "react";
import CheckTree from "./CheckTree";
import { CheckTreeNodeElement } from "./CheckTreeNodeElement";


export default class CheckTreeNode extends React.Component<any,any> {
    expanded: boolean = false;
    constructor(props: any) {
        super(props);
        this.toggleExpanded = this.toggleExpanded.bind(this);
        this.selectionChanged = this.selectionChanged.bind(this);
    }

    componentDidMount(): void {
        this.forceUpdate();
    }

    toggleExpanded(e: any) {
        this.expanded = !this.expanded;
        this.forceUpdate();
    }

    selectionChanged(e: any) {
        let tree: CheckTree = this.props.tree;
        let node: CheckTreeNodeElement = tree.tree.getNode(this.props.internalId);
        node.setSelected(e.currentTarget.checked,true,false);
    }

    render() {
        let tree: CheckTree = this.props.tree;
        let node: CheckTreeNodeElement = tree.tree.getNode(this.props.internalId);
        
        let nodes: any[] = [];
        node?.children?.forEach((node: CheckTreeNodeElement) =>{
            nodes.push(
                <CheckTreeNode 
                    key={node.internalId}
                    tree = {this.props.tree}
                    parent = {this}
                    internalId = {node.internalId}
                    expanded = {node.selected}
                />
            );
        });
        let expander: any;
        if(nodes.length > 0) {
            let expanderIcon: string;
            let expanderTooltip: string;
            let expanderHandler: (e: any)=> void;
            if(node?.hasSelectedChildren() === true) {
                expanderIcon = "asterisk";
                this.expanded = true;
                expanderTooltip="This item has selected children";
            }
            else {
                expanderIcon = this.expanded===true? "minus":"plus";
                expanderTooltip = this.expanded===true? "Collapse":"Expand";
                expanderHandler = this.toggleExpanded;
            } 
            expander=(
                <span 
                    className={"glyphicon glyphicon-" + expanderIcon}
                    onClick={expanderHandler}
                    title={expanderTooltip}
                />
            );
        }
        let checkBox: any = (
            <input 
                type="checkBox"
                checked={node.selected}
                onChange={this.selectionChanged}
            />
        );

        //calculate indent
        let nodeStyle: CSSProperties = {};
        nodeStyle.marginLeft = "1rem";//(node.level * 1) + "rem";

        return(
            <div
                className="chtr-node"
                style={nodeStyle}
            >
                <div
                    className="chtr-node-header"
                >
                    <div
                        className="chtr-node-expander"
                    >
                        {expander} 
                    </div>
                    <div
                        className="chtr-node-selector"
                    >
                        {checkBox}
                    </div>
                    <div
                        className="chtr-node-title"
                    >
                        <span>
                            {node?.name}
                        </span>
                    </div>
                </div>
                {(this.expanded===true) &&
                    nodes
                }
            </div>
        )
    }
}
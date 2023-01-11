import { FlowComponent, FlowObjectData, FlowObjectDataArray } from "flow-component-model";
import React from "react";
import "./CheckTree.css";
import CheckTreeNode from "./CheckTreeNode";
import { CheckTreeNodeElement, CheckTreeNodeElements } from "./CheckTreeNodeElement";

declare var manywho: any;

export default class CheckTree extends FlowComponent {
    
    tree: CheckTreeNodeElements;

    constructor(props: any) {
        super(props);
        this.moveHappened = this.moveHappened.bind(this);
        this.parseModel = this.parseModel.bind(this);
        this.saveTree = this.saveTree.bind(this);
    }

    async componentDidMount(): Promise<void> {
        await super.componentDidMount();
        (manywho as any).eventManager.addDoneListener(this.moveHappened, this.componentId);
        this.parseModel();
    }

    moveHappened(xhr: XMLHttpRequest, request: any) {
        if ((xhr as any).invokeType === 'FORWARD') {
            this.parseModel();
        }
    }

    parseModel() {
        let model: FlowObjectDataArray = this.model.dataSource as FlowObjectDataArray;
        let config: any = {
            idProperty: this.getAttribute("idProperty"),
            nameProperty: this.getAttribute("nameProperty"),
            typeProperty: this.getAttribute("typeProperty"),
            addressProperty: this.getAttribute("addressProperty"),
            childrenProperty: this.getAttribute("childrenProperty"),
        };
        this.tree = CheckTreeNodeElements.parse(model,config);
        this.forceUpdate();
    }

    async saveTree() {
        //let objData: FlowObjectData = this.kwestionaire.makeObjectData();
        //await this.setStateValue(objData);
        //if(this.outcomes.Save) {
        //    await this.triggerOutcome("Save")
        //}
    }

    render() {
        let nodes: any[] = [];
        this.tree?.children?.forEach((node: CheckTreeNodeElement) =>{
            nodes.push(
                <CheckTreeNode 
                    tree = {this}
                    parent = {this}
                    internalId = {node.internalId}
                />
            );
        });
        return (
        <div
            className="chtr"
        >
            {nodes}
        </div>
        );
    }
}

manywho.component.registerItems("CheckTree", CheckTree);
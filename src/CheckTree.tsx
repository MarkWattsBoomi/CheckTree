import { FlowComponent, FlowObjectData, FlowObjectDataArray } from "flow-component-model";
import React, { CSSProperties } from "react";
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
        this.changeHandler = this.changeHandler.bind(this);
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

    changeHandler(nodeId: string) {
        this.saveTree();
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
        this.tree = CheckTreeNodeElements.parse(model,config,this.changeHandler);
        this.forceUpdate();
    }

    async saveTree() {
        let objData: FlowObjectDataArray = this.tree.makeObjectData();
        await this.setStateValue(objData);
        let onChangeOutcomeName: string = this.getAttribute("onChangeHandler");
        if(onChangeOutcomeName && this.outcomes[onChangeOutcomeName]){
            await this.triggerOutcome(onChangeOutcomeName)
        }
        else {
            if(this.model.hasEvents===true) {
                await manywho.engine.sync(this.flowKey);
            }
            else {
                this.forceUpdate();
            }
        }
    }

    render() {
        const style: CSSProperties = {};
        style.width = '-webkit-fill-available';
        style.height = '-webkit-fill-available';

        if (this.model.visible === false) {
            style.display = 'none';
        }
        if (this.model.width) {
            style.width = this.model.width + 'vw';
        }
        if (this.model.height > 0) {
            style.height = this.model.height + 'vh';
        } 
        else {
            style.height = this.getAttribute("height",'60vh');
        }
        
        let nodes: any[] = [];
        this.tree?.children?.forEach((node: CheckTreeNodeElement) =>{
            nodes.push(
                <CheckTreeNode 
                    tree = {this}
                    parent = {this}
                    internalId = {node.internalId}
                    expanded={true}
                />
            );
        });

        
        
        return (
        <div
            className="chtr"
            style={style}
        >
            {nodes}
        </div>
        );
    }
}

manywho.component.registerItems("CheckTree", CheckTree);
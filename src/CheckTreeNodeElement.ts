import { eContentType, FlowObjectData, FlowObjectDataArray, FlowObjectDataProperty } from "flow-component-model";

export class CheckTreeNodeElements {
    children: Map<string,CheckTreeNodeElement>;
    config: any;
    changeHandler: (nodeId: string)=>void;

    constructor() {
        this.children = new Map();
    }

    public static parse(objectData: FlowObjectDataArray, config: any, changeHandler: (nodeId: string)=>void) : CheckTreeNodeElements {
        let nodes: CheckTreeNodeElements = new CheckTreeNodeElements();
        nodes.config = config;
        nodes.changeHandler = changeHandler;
        objectData.items.forEach((item: FlowObjectData) =>{
            let node: CheckTreeNodeElement = CheckTreeNodeElement.parse(item, nodes, nodes,0);
            nodes.children.set(node.internalId, node);
        });
        return nodes;
    }

    getNode(internalId: string): CheckTreeNodeElement {
        let node: CheckTreeNodeElement;
        for(let child of this.children.values()) {
            let tChild: CheckTreeNodeElement = child.getNode(internalId);
            if(tChild) {
                return tChild;
            }
        }
        return undefined;
    }

    onChange(nodeId: string) {
        if(this.changeHandler) {
            this.changeHandler(nodeId);
        }
    }

    makeObjectData(): FlowObjectDataArray {
        let objData: FlowObjectDataArray = new FlowObjectDataArray();
        this.children.forEach((child: CheckTreeNodeElement) => {
            if(child.selected === true) {
                objData.addItem(child.makeObjectData());
            }
        });
        return objData;
    }
}

export class CheckTreeNodeElement {
    root: CheckTreeNodeElements;
    parent: CheckTreeNodeElements | CheckTreeNodeElement;
    internalId: string;
    id: string;
    name: string;
    address: string;
    type: string;
    children: Map<string,CheckTreeNodeElement>
    selected: boolean;
    level: number;
    objectType: string;

    constructor() {
        this.children = new Map();
    }

    public static parse(objectData: FlowObjectData, root: CheckTreeNodeElements, parent: CheckTreeNodeElements | CheckTreeNodeElement, level: number) : CheckTreeNodeElement {
        let node: CheckTreeNodeElement = new CheckTreeNodeElement();
        node.objectType = objectData.developerName;
        node.level = level + 1;
        node.root = root;
        node.parent = parent;
        node.internalId = objectData.internalId;
        node.selected = objectData.isSelected;
        node.id = objectData.properties[root.config.idProperty]?.value as string;
        node.name = objectData.properties[root.config.nameProperty]?.value as string;
        node.address = objectData.properties[root.config.addressProperty]?.value as string;
        node.type = objectData.properties[root.config.typeProperty]?.value as string;
        let children: FlowObjectDataArray = objectData.properties[root.config.childrenProperty]?.value as FlowObjectDataArray;
        if(children && children.items.length > 0) {
            children.items.forEach((item: FlowObjectData) => {
                // debug if(node.children.size < 1){
                let child: CheckTreeNodeElement = CheckTreeNodeElement.parse(item, node.root, node, node.level);
                node.children.set(child.internalId, child);
                //}
            });
        }
        return node;
    }

    getNode(internalId: string): CheckTreeNodeElement {
        if(this.internalId === internalId) {
            return this;
        }
        else {
            let node: CheckTreeNodeElement;
            for(let child of this.children.values()) {
                let tChild: CheckTreeNodeElement = child.getNode(internalId);
                if(tChild) {
                    return tChild;
                }
            }
            return undefined;
        }
    }

    hasSelectedChildren(): boolean {
        let result: boolean = false;
        for(let child of this.children.values()) {
            if(child.selected===true || child.hasSelectedChildren()===true) {
                return true;
            }
        }
        return false;
    }

    setSelected(selected: boolean, cascade: boolean, preventBubble: boolean) {
        //if(this.selected !== selected) {
            this.selected = selected;
            if(cascade===true) {
                this.children.forEach((child: CheckTreeNodeElement) => {
                    child.setSelected(selected, cascade, true)
                });
            }
            if(selected===true) {
                if(this.parent instanceof CheckTreeNodeElement) {
                    this.parent.setSelected(selected,false,true);
                }
            }
            if(preventBubble===false) {
                this.root.onChange(this.internalId);
            }
        //}
        
    }

    makeObjectData() : FlowObjectData {
        let objData: FlowObjectData = FlowObjectData.newInstance(this.objectType);
        objData.internalId = this.internalId;
        objData.isSelected = this.selected;
        objData.addProperty(FlowObjectDataProperty.newInstance(this.root.config.idProperty, eContentType.ContentString, this.id));
        objData.addProperty(FlowObjectDataProperty.newInstance(this.root.config.nameProperty, eContentType.ContentString, this.name));
        objData.addProperty(FlowObjectDataProperty.newInstance(this.root.config.typeProperty, eContentType.ContentString, this.type));
        objData.addProperty(FlowObjectDataProperty.newInstance(this.root.config.addressProperty, eContentType.ContentString, this.address));
        let children: FlowObjectDataArray = new FlowObjectDataArray();
        for(let child of this.children.values()) {
            if(child.selected === true) {
                children.addItem(child.makeObjectData());
            }
        }
        objData.addProperty(FlowObjectDataProperty.newInstance(this.root.config.childrenProperty, eContentType.ContentList, children));
        return objData;
    }
    
}
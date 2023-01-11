import { FlowObjectData, FlowObjectDataArray } from "flow-component-model";

export class CheckTreeNodeElements {
    children: Map<string,CheckTreeNodeElement>;
    config: any;
    constructor() {
        this.children = new Map();
    }

    public static parse(objectData: FlowObjectDataArray, config: any) : CheckTreeNodeElements {
        let nodes: CheckTreeNodeElements = new CheckTreeNodeElements();
        nodes.config = config;
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

    constructor() {
        this.children = new Map();
    }

    public static parse(objectData: FlowObjectData, root: CheckTreeNodeElements, parent: CheckTreeNodeElements | CheckTreeNodeElement, level: number) : CheckTreeNodeElement {
        let node: CheckTreeNodeElement = new CheckTreeNodeElement();
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
                let child: CheckTreeNodeElement = CheckTreeNodeElement.parse(item, node.root, node, level);
                node.children.set(child.internalId, child);
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
    
}
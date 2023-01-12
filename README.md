

# CheckTree
![SFT Image](https://github.com/MarkWattsBoomi/CheckTree/blob/main/checktree.png)

## Functionality

- Provides a configurable tree view with checkbox selectable nodes.
- The tree can be expanded/contracted to drill down.
- Selected nodes are forced to have their parent hierarchy expanded.
- Selecting / deselecting a node will set all child nodes to the same selection state.
- The user can select any item from the tree.
- The tree expects a consistent hierarchical data model with each level having the same attribute names for the properties and the child elements.
- The attributes of the datasource model are configured via attributes described below.

## DataSource

Set the datasource to a list objects of any type, each type must have an id column, a label column, a children column and a parent column.

## State

A list of the same type as the datasource model

## Settings

### Width & Height

If specified then these are applied as vh & vw values.

## Component Attributes

### classes

Like all components, adding a "classes" attribute will cause that string to be added to the base component's class value

### idProperty

The name of the property of the model object containing the primary id.

### labelProperty

The name of the property of the model object containing the objects label as displayed in the tree. 

### typeProperty

The name of the property of the model object containing the type of the object - NOT USED.

### addressProperty

The name of the property of the model object containing an address - NOT USED.

### childrenProperty

The name of the property of the model object containing the object's children. 


## Styling

All elements of the tree can be styled by adding the specific style names to your player.


## Page Conditions

The component respects the show / hide rules applied by the containing page.



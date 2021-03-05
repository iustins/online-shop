import React, { Component } from 'react';
import Popup from "reactjs-popup";
import ChangeIcon from "./changeIcon";

export default class EditableTable extends Component {

    constructor(props) {
        super(props);

        this.state = {
            edits: [],
            items: this.props.data
        };

    };

    onDragStart = (e, index) => {
        this.startIndex = index;
        this.draggedItem = this.state.items[index];
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/html", e.target.parentNode);
        e.dataTransfer.setDragImage(e.target.parentNode, 0, 20);
    };

    onDragOver = index => {
        this.lastIndex = index;
        const draggedOverItem = this.state.items[index];

        // if the item is dragged over itself, ignore
        if (this.draggedItem === draggedOverItem) {
            return;
        }

        // filter out the currently dragged item
        let items = this.state.items.filter(item => item !== this.draggedItem);
        this.modified = true;
        // add the dragged item after the dragged over item
        items.splice(index, 0, this.draggedItem);

        this.setState({items});
    };

    onDragEnd = () => {
        this.draggedIdx = null;
        if (this.startIndex != this.lastIndex) {
            //    this.props.parent.reorderInDB(this.state.items);
        }
    };

    renderColumns() {
        let columns = this.props.columns;
        if (columns.indexOf("Actions") < 0)
            columns.push("Actions");

        return columns.map(
            (col, index) => {
                return <th>{col}</th>;
            }
        );
    }

    setEdited(obj, key) {
        if (key == "id" || key == 'image')
            return;

        if (this.state.edits.indexOf(obj.name + "_" + key) < 0)
            this.state.edits.push(obj.name + "_" + key);
        this.forceUpdate();
    }

    deleteEdited(obj) {
        let newArr = [];
        for (var i = 0; i < this.state.edits.length; i++) {
            if (this.state.edits[i].indexOf(obj.name) < 0) {
                newArr.push(this.state.edits[i]);
            }
        }

        this.state.edits = newArr;
        this.forceUpdate();
    }

    deleteEditedCol(obj, key) {
        let newArr = [];
        for (var i = 0; i < this.state.edits.length; i++) {
            if (this.state.edits[i].indexOf(obj.name + "_" + key) < 0) {
                newArr.push(this.state.edits[i]);
            }
        }

        this.state.edits = newArr;
        this.forceUpdate();
    }

    isEdited(obj) {
        var found = false;
        for (let i = 0; i < this.state.edits.length; i++) {
            if (this.state.edits[i].indexOf(obj.name + "_") > -1) {
                found = true;
                break;
            }
        }
        return found;
    }

    isEditedCol(obj, key) {

        if (this.state.edits.indexOf(obj.name + "_" + key) > -1)
            return true;

        return false;

    }

    returnToNormal(obj) {

        let row = document.getElementById("row_" + obj.id);
        let cells = row.getElementsByTagName("td");
        let i = 0;
        for (const key of Object.keys(obj)) {
            if (i > 0) {
                if (this.props.fromParent == 'operator' && key == 'visible_in_footer')
                    cells[i].getElementsByTagName("input")[0].checked = obj[key] == '1' ? true : false;
                else if (this.props.fromParent == 'operator' && key == 'image')
                    cells[i].getElementsByTagName('img')[0].src = obj[key];
                else if (this.props.fromParent == 'channelpack' && key == 'image')
                    cells[i].getElementsByTagName('img')[0].src = obj[key];
                else
                    cells[i].innerHTML = obj[key];
            }
            i++;
        }

        this.deleteEdited(obj);
    }

    renderObjectInRow(obj, index) {

        let result = [];
        for (const key of Object.keys(obj)) {

            var value;
            if (key == 'id')
                value = index;
            else
                value = obj[key];

            if (this.props.fromParent == "operator") {
                if (key == 'visible_in_footer') {
                    result.push(<td>
                        <input
                            onClick={(e) => {
                                if (!this.isEditedCol(obj, key))
                                    this.setEdited(obj, key);
                                else
                                    this.deleteEditedCol(obj, key);
                            }}
                            type="checkbox"
                            checked={((!this.isEditedCol(obj, key) && value == '1') || (this.isEditedCol(obj, key) && value != '1')) ? true : false}
                        />
                    </td>);
                } else if (key == 'description') {
                    result.push(<td
                        onDoubleClick={(e) => {
                            this.setEdited(obj, key)
                        }}
                        contentEditable={this.isEditedCol(obj, key)}
                        className={this.isEditedCol(obj, key) ? "being-edited description-col" : "not-being-edited description-col"}>{value}</td>);
                } else if (key == 'image') {
                    result.push(<td
                        className={"image-obj"}><img src={value} />
                        <Popup trigger={<div className="change-image-button">Change</div>}
                               position="center"
                               modal>
                            {close => (
                                <div>
                                    <ChangeIcon object={obj} fromParent="operator" token={this.props.parent.state.token} closeFunc={close}/>
                                </div>
                            )}
                        </Popup>
                        </td>);
                } else {
                    result.push(<td
                        onDoubleClick={(e) => {
                            this.setEdited(obj, key)
                        }}
                        contentEditable={this.isEditedCol(obj, key)}
                        className={this.isEditedCol(obj, key) ? "being-edited" : "not-being-edited"}>{value}</td>);
                }
            } else if (this.props.fromParent == "channelpack") {
                if (key == 'image') {
                    result.push(<td
                        className={"image-obj"}><img src={value} />
                        <Popup trigger={<div className="change-image-button">Change</div>}
                               position="center"
                               modal>
                            {close => (
                                <div>
                                    <ChangeIcon object={obj} fromParent="channelpack" token={this.props.parent.state.token} closeFunc={close}/>
                                </div>
                            )}
                        </Popup>
                    </td>);
                } else {
                    result.push(<td
                        onDoubleClick={(e) => {
                            this.setEdited(obj, key)
                        }}
                        contentEditable={this.isEditedCol(obj, key)}
                        className={this.isEditedCol(obj, key) ? "being-edited" : "not-being-edited"}>{value}</td>);
                }
            }
            else
                result.push(<td
                    onDoubleClick={(e) => {
                        this.setEdited(obj, key)
                    }}
                    contentEditable={this.isEditedCol(obj, key)}
                    className={this.isEditedCol(obj, key) ? "being-edited" : "not-being-edited"}>{value}</td>);
        }

        result.push(<td>
            <span
                onClick={(e) => {
                    if (this.isEdited(obj)) {
                        this.deleteEdited(obj);
                        this.props.parent.saveEdit(obj.id);
                    }
                }}
                className={this.isEdited(obj) ? "being-edited button" : "not-being-edited button"}>
                Save
            </span>
            <span
                onClick={(e) => {
                    if (this.isEdited(obj)) {
                        this.returnToNormal(obj);
                    }
                }}
                className={this.isEdited(obj) ? "being-edited button" : "not-being-edited button"}>
                Cancel
            </span>
            <span onClick={(e) => {
                this.props.parent.deleteElement(obj.id)
            }}
                  className={this.isEdited(obj) ? "not-being-edited button" : "being-edited button"}>Delete</span>
        </td>);

        return result;
    }

    renderRows() {
        let data = this.state.items;

        return data.map(
            (obj, index) => {
                return <tr
                    id={"row_" + obj.id}
                    className="drag"
                    draggable
                    onDragStart={e => this.onDragStart(e, index)}
                    onDragEnd={this.onDragEnd}
                    onDragOver={() => this.onDragOver(index)}>
                    {this.renderObjectInRow(obj, index + 1)}
                </tr>;
            }
        );
    }

    render() {
        if (!this.modified) {
            this.state.items = this.props.data;
        }
        this.modified = false;
        return (
            <table className="editable-table">
                <tr>
                    {this.renderColumns()}
                </tr>
                {this.renderRows()}
            </table>
        );
    }
  }
;

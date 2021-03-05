import React, {Component} from 'react';
import { serverName } from "../../../helpers";

export default class ChangeIcon extends Component {
    constructor(props) {
        super(props);


    }
    
    saveNewPhotoOperator() {
        //console.log(this.props.object);
        var request = new XMLHttpRequest();

        var formData = new FormData();
        formData.append("id", this.props.object.id);
        formData.append("name", this.props.object.name);
        formData.append("h1", this.props.object.h1);
        formData.append("meta_title", this.props.object.meta_title);
        formData.append("meta_description", this.props.object.meta_description);
        formData.append("description", this.props.object.description);
        formData.append("testo_top", this.props.object.testo_top);
        formData.append("visible_in_footer", this.props.object.visible_in_footer);
        formData.append("image", document.getElementsByName("image")[0].files[0]);

        request.open('POST', serverName + 'api/operators/changePhoto?token=' + this.props.token, false);
        request.send(formData);
        //console.log(request.response);
        window.location.href = "../adsl/operatori";
    }

    saveNewPhotoChannelPack() {
        //console.log(this.props.object);
        var request = new XMLHttpRequest();

        var formData = new FormData();
        formData.append("id", this.props.object.id);
        formData.append("name", this.props.object.name);
        formData.append("image", document.getElementsByName("image")[0].files[0]);
        formData.append("nr_channels", this.props.object.nr_channels);

        request.open('POST', serverName + 'api/channelpack/changePhoto?token=' + this.props.token, false);
        request.send(formData);
        //console.log(request.response);
        window.location.href = "../adsl/channelpacks";
    }

    render() {
        if (this.props.fromParent == 'operator')
            return (
                <div className="popup-image-change">
                    <div className="popup-image-change-top">
                        <span>Change photo for <b>{this.props.object.name}</b></span><span className="close-span"
                                                                                           onClick={this.props.closeFunc}>X</span>
                    </div>
                    <form encType="x-www-form-urlencoded">
                        <input type="file" name="image"/>
                        <div><span onClick={(e) => {
                            this.saveNewPhotoOperator()
                        }}>Save</span><span onClick={this.props.closeFunc}>Cancel</span></div>
                    </form>
                </div>
            );
        else
            return (
                <div className="popup-image-change">
                    <div className="popup-image-change-top">
                        <span>Change photo for <b>{this.props.object.name}</b></span><span className="close-span"
                                                                                           onClick={this.props.closeFunc}>X</span>
                    </div>
                    <form encType="x-www-form-urlencoded">
                        <input type="file" name="image"/>
                        <div><span onClick={(e) => {
                            this.saveNewPhotoChannelPack()
                        }}>Save</span><span onClick={this.props.closeFunc}>Cancel</span></div>
                    </form>
                </div>
            );
    }
}

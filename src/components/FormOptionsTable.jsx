"use strict";
import React, {Component} from "react";
import PropTypes from "prop-types";
import startCase from "lodash/startCase";
import update from "immutability-helper";

class FormOptionsTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fields: {...this.props.fields},
            options: [],
            optionEdit: false,
            optionID: -1
        };
        this.key = this.props.formKey;
    }

    componentDidMount() {
        if(this.props.options !== null && this.props.options !== undefined) {
            this.setState({options: [...this.props.options]});
            this.updateFormInfo(this.props.options);
        }
    }

    /* componentDidUpdate() {
        if(this.props.options !== undefined) {
            this.updateFormInfo(this.props.options);
            this.setState({
                options: this.props.options
            });
        }
    } */

    handleOptionChange = (e) => {
        e && e.preventDefault();
        const {name, value} = e.target;

        this.setState({
            option: {
                [name]: value
            }
        });
        this.props.modifyState({
            [name]: value
        });
    }

    handleOptionDelete = (e) => {
        let tempOptions = this.state.options;
        tempOptions.splice(e.currentTarget.getAttribute("data-id"), 1);
        this.setState({options: tempOptions});
    }

    handleOptionEdit = (e) => {
        const option = this.state.options[e.currentTarget.getAttribute("data-id")];
        this.setState({option:option, optionEdit:true, optionID:e.currentTarget.getAttribute("data-id")});
        this.props.modifyState({
            ...option
        });
    }

    insertOption = (e) => {
        e && e.preventDefault();
        const key = this.key;
        const index = this.state.optionID;
        const newOpt = {
            ...this.props.formData
        };
        for(let formItem in newOpt) {
            if(Object.keys(this.props.fields).indexOf(formItem) === -1) delete newOpt[formItem];
        }
        if(this.state.optionID === -1) { // If we're not editing an option
            this.setState(prevState => ({options: [...prevState.options, newOpt]}), () => {
                this.props.modifyState({[key]: this.state.options});
            });
        } else { // We're editing an option
            let newState = update(this.state, {
                options: {
                    [index]: { $set: newOpt}
                }
            });
            this.setState({...newState, optionID: -1}, () => {
                this.props.modifyState({[key]: this.state.options});
            });
        }
    }

    updateFormInfo = (options) => {
        this.props.modifyState({
            [this.key]: [...options]
        });
    }

    render() {
        const {fields, options} = this.state;

        return (
            <div className="inputSection formFlex">
                <label>{startCase(this.props.formKey)}</label>
                <table id="productOptionsTable">
                    <tbody>
                        {options && options.length > 0 && options.map((opt, index) => {
                            return (
                                <tr key={index}>
                                    {Object.keys(opt).map((val, index) => {
                                        if(Object.keys(fields).indexOf(val) > -1) {
                                            return (
                                                <td key={index} className="optionDetail">{opt[val]}</td>
                                            );
                                        }
                                    })}
                                    {this.props.editable && <td className="fa fa-wrench" data-id={index} onClick={this.handleOptionEdit}></td>}
                                    <td className="fa fa-trash" data-id={index} onClick={this.handleOptionDelete}></td>
                                </tr>
                            );
                        })}
                        <tr className="optionEntry">
                            {fields && Object.keys(fields).map((opt, index) => {
                                return (
                                    <td key={index}>
                                        {this.props.renderInput(opt, fields)}
                                    </td>
                                );
                            })}
                        </tr>

                    </tbody>
                </table>
                <input type="submit" className="half" id="insertProductOption" value="Insert" onClick={this.insertOption}/>
            </div>
        );
    }
}

FormOptionsTable.propTypes = {
    editable: PropTypes.bool,
    fields: PropTypes.object,
    formData: PropTypes.object,
    formKey: PropTypes.string,
    modifyState: PropTypes.func,
    options: PropTypes.arrayOf(PropTypes.object),
    renderInput: PropTypes.func,
};

export default FormOptionsTable;

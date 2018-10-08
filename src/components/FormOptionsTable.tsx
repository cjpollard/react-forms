"use strict";
import * as React from 'react';

import update from 'immutability-helper';
import {startCase} from 'lodash';

export interface IFormOptionsTableProps {
    editable: boolean,
    fields: object,
    formData: object,
    formKey: string,
    modifyState: any,
    options: object[],
    renderInput: any,
}

export interface IFormOptionsTableState {
    fields: object,
    optionEdit: boolean,
    optionID: number,
    options: object[],
    option: object
}

class FormOptionsTable extends React.Component<IFormOptionsTableProps, IFormOptionsTableState> {
    public state: any;
    private key: string;

    constructor(props: IFormOptionsTableProps) {
        super(props);
        this.state = {
            fields: {...this.props.fields},
            optionEdit: false,
            optionID: -1,
            options: []
        };
        this.key = this.props.formKey;
    }

    public componentDidMount() {
        if(this.props.options !== null && this.props.options !== undefined) {
            this.setState({options: [...this.props.options]});
            this.updateFormInfo(this.props.options);
        }
    }

    public handleOptionChange = (e?: any) => {
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

    public handleOptionDelete = (e?: any) => {
        const tempOptions = this.state.options;
        tempOptions.splice(e.currentTarget.getAttribute("data-id"), 1);
        this.setState({options: tempOptions});
    }

    public handleOptionEdit = (e?: any) => {
        const option = this.state.options[e.currentTarget.getAttribute("data-id")];
        this.setState({option, optionEdit:true, optionID:e.currentTarget.getAttribute("data-id")});
        this.props.modifyState({
            ...option
        });
    }

    public insertOption = (e?: any) => {
        e && e.preventDefault();

        const key = this.key;
        const index = this.state.optionID;
        const newOpt = {
            ...this.props.formData
        };
        for(const formItem in newOpt) {
            if(Object.keys(this.props.fields).indexOf(formItem) === -1) {
                delete newOpt[formItem];
            }
        }
        if(this.state.optionID === -1) { // If we're not editing an option
            this.setState(prevState => ({options: [...prevState.options, newOpt]}), () => {
                this.props.modifyState({[key]: this.state.options});
            });
        } else { // We're editing an option
            const newState = update(this.state, {
                options: {
                    [index]: { $set: newOpt}
                }
            });
            this.setState({...newState, optionID: -1}, () => {
                this.props.modifyState({[key]: this.state.options});
            });
        }
    }

    public updateFormInfo = (options: any) => {
        this.props.modifyState({
            [this.key]: [...options]
        });
    }

    public render() {
        const {fields, options} = this.state;

        return (
            <div className="inputSection formFlex">
                <label>{startCase(this.props.formKey)}</label>
                <table id="productOptionsTable">
                    <tbody>
                        {options && options.length > 0 && options.map((opt: object, index: number) => {
                            return (
                                <tr key={index}>
                                    {Object.keys(opt).map((val, i) => {
                                        if(Object.keys(fields).indexOf(val) > -1) {
                                            return (
                                                <td key={i} className="optionDetail">{opt[val]}</td>
                                            );
                                        } else {
                                            return null;
                                        }
                                    })}
                                    {this.props.editable && <td className="fas fa-wrench" data-id={index} onClick={this.handleOptionEdit}/>}
                                    <td className="fas fa-trash" data-id={index} onClick={this.handleOptionDelete}/>
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

export default FormOptionsTable;

import * as React from 'react';
import {DropzoneComponent} from 'react-dropzone-component';
import {startCase} from 'lodash';
import {DatePicker, FieldWrapper} from './index';
import FormOptionsTable from './FormOptionsTable';

export interface IFormBuilderProps {
    formData: any,
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => void,
    modifyState: (state: any) => void
}

export class FormBuilder extends React.Component<IFormBuilderProps> {
    private fileDropConfig = {
        iconFileTypes: [".jpg", ".png", ".gif"],
        showFiletypeIcon: true,
        postUrl: "/apis/editor/uploadFiles"
    };

    private djsConfig = {
        acceptedFiles: "image/*",
        maxFileSize: 0.5,
        maxFiles: 5
    };

    private djsEvents = {
        success: () => {}
    };

    private editAdd: boolean;

    private useExisting: boolean;

    constructor(props: any) {
        super(props);
    }

    private buildTimesList = () => {
        let times = [];
        for(let i=0; i<24; i++) {
            const leadingO = i<10 ? "0": "";
            const time = leadingO + i.toString() + ":00";
            times.push({"value": time, "label": time});
        }
        return times;
    }

    private handleDayChange = (day: string, inputProps: any) => {
        const name: string = inputProps.name || "date";
        // this.props.modifyState({[name]: day});
    }

    private renderStringInput(label: string, name: string, placeholder: string) {
        return (
            <FieldWrapper id={name} label={label}>
                <input type="text" name={name} placeholder={placeholder} id={name} key={name}
                    {...((this.editAdd || this.useExisting) && {value: this.props.formData ? this.props.formData[name] : ""})} onChange={this.props.handleInputChange}/>
            </FieldWrapper>
        );
    }

    private renderTextareaInput(label: string, name: string) {
        return (
            <FieldWrapper id={name} label={label}>
                <textarea placeholder="Enter description" name={name} id="description" rows={4} cols={30} key={name}
                    {...((this.editAdd || this.useExisting) && {value: this.props.formData ? this.props.formData[name] : ""})} onChange={this.props.handleInputChange}></textarea>
            </FieldWrapper>
        );
    }

    private renderDateInput(label: string, name: string) {
        return (
            <FieldWrapper id={name} label={label}>
                <DatePicker onDayChange={this.handleDayChange} {...((this.editAdd || this.useExisting) && {value: this.props.formData ? this.props.formData[name] : ""})}
                    placeholder="D-M-YYYY" inputProps={{name: name}} key={name}/>
            </FieldWrapper>
        );
    }

    private renderDropdown(label: string, options: Array<any>, key: string, multi?: boolean) {
        return (
            <FieldWrapper id={name} label={label}>
                <select className="optionTitle" key={key} name={key} {...(multi && {multiple: true, size: 8})} defaultValue="default" onChange={this.props.handleInputChange}>
                    <option value="default" disabled>Select an option</option>
                    {options && options.map((opt, index) => {
                        return <option key={index} value={opt.value} {...(opt.value === "-" && {disabled: true})}>{opt.label}</option>;
                    })}
                </select>
            </FieldWrapper>
        );
    }

    private renderFileInput(label: string, type: string) {
        return (
            <div className="inputSection formFlex clearBoth">
                <label htmlFor="fileUpload">{label}</label>
                <DropzoneComponent config={this.fileDropConfig} djsConfig={{params: {fileType: type}, ...this.djsConfig}} eventHandlers={this.djsEvents}/>
            </div>
        );
    }

    private renderTable(label: string, key: string, fields: Array<any>) {
        return <FormOptionsTable editable={false} fields={fields} formData={this.props.formData} formKey={key} modifyState={this.props.modifyState} options={this.props.formData[key]} renderInput={this.renderFromObjectKey}/>;
    }

    private renderInnerFormSection(value: string, key: string, label:string) {
        return (
            <div>
                <label>{label}</label>
                <div className="formInForm">
                    <hr/>
                    {Object.keys(value).map((o => {
                        return this.renderFromObjectKey(o, value, key);
                    }))}
                    <hr/>
                </div>
            </div>
        );
    }

    private renderFromObjectKey = (key: string, obj: Object, parentKey: string): any => {
        const value = obj[key].type;
        const label = obj[key].label;
        const options = obj[key].options;
        const fields = obj[key].fields;
        const fileType = obj[key].fileType;
        const pLabel = startCase(parentKey);
        const times = this.buildTimesList();

        // If key is an int, we know we're looking at an array.
        if(!isNaN(parseInt(key, 10))) {
            return this.renderStringInput(pLabel, value, pLabel);
        }
        if(typeof value === "string") {
            switch(value) {
                case "date":
                    return this.renderDateInput(label, key);
                case "time":
                    return this.renderDropdown(label, times, key);
                case "file":
                    return this.renderFileInput(label, fileType);
                case "text":
                    return this.renderTextareaInput(label, key);
                case "table":
                    return this.renderTable(label, key, fields);
                case "array":
                case "dropdown":
                    return this.renderDropdown(label, options, key);
                case "string":
                default:
                    return this.renderStringInput(label, key, label);
            }
        }
        if(typeof value === "object") {
            return this.renderInnerFormSection(value, key, label);
        }
    }

    public render() {
        return(
            <></>
        );
    }
}
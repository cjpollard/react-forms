import * as React from 'react';
import {DropzoneComponent} from 'react-dropzone-component';
import {startCase} from 'lodash';
import {DatePicker, FieldWrapper} from './index';
import FormOptionsTable from './FormOptionsTable';
import {FormWrapper} from './FormWrapper';

export interface IFormBuilderProps {
    formData: any,
    formScheme: object,
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => void,
    id: string,
    modifyState: (state: any) => void
}

export class FormBuilder extends React.Component<IFormBuilderProps> {
    private fileDropConfig: object = {
        iconFileTypes: [".jpg", ".png", ".gif"],
        showFiletypeIcon: true,
        postUrl: "/apis/editor/uploadFiles"
    };

    private djsConfig: object = {
        acceptedFiles: "image/*",
        maxFileSize: 0.5,
        maxFiles: 5
    };

    private djsEvents: object = {
        success: () => {}
    };

    private editAdd: boolean;

    private useExisting: boolean;

    constructor(props: any) {
        super(props);
    }

    private buildTimesList = (interval = 1): Array<object> => {
        let times: Array<object> = [];
        const upperLimit: number = interval*24;
        for(let i=0; i<upperLimit; i++) {
            const leadingO: string = i<10 ? "0": "";
            const trailing30: string = upperLimit === 48 && upperLimit%2 !== 0 ? "30" : "00";
            const time: string = leadingO + i.toString() + ":" + trailing30;
            times.push({"value": time, "label": time});
        }
        return times;
    }

    private handleDayChange = (day: string, inputProps: any): void => {
        const name: string = inputProps.name || "date";
        this.props.modifyState({[name]: day});
    }

    private renderStringInput(label: string, name: string, placeholder: string): JSX.Element {
        return (
            <FieldWrapper id={name} label={label}>
                <input type="text" name={name} placeholder={placeholder} id={name} key={name}
                    {...((this.editAdd || this.useExisting) && {value: this.props.formData ? this.props.formData[name] : ""})} onChange={this.props.handleInputChange}/>
            </FieldWrapper>
        );
    }

    private renderTextareaInput(label: string, name: string): JSX.Element {
        return (
            <FieldWrapper id={name} label={label}>
                <textarea placeholder="Enter description" name={name} id="description" rows={4} cols={30} key={name}
                    {...((this.editAdd || this.useExisting) && {value: this.props.formData ? this.props.formData[name] : ""})} onChange={this.props.handleInputChange}></textarea>
            </FieldWrapper>
        );
    }

    private renderDateInput(label: string, name: string): JSX.Element {
        return (
            <FieldWrapper id={name} label={label}>
                <DatePicker onDayChange={this.handleDayChange} {...((this.editAdd || this.useExisting) && {value: this.props.formData ? this.props.formData[name] : ""})}
                    placeholder="D-M-YYYY" inputProps={{name: name}} key={name}/>
            </FieldWrapper>
        );
    }

    private renderDropdown(label: string, options: Array<any>, key: string, multi?: boolean): JSX.Element {
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

    private renderFileInput(label: string, type: string): JSX.Element {
        return (
            <FieldWrapper id="fileUpload" label={label}>
                <DropzoneComponent config={this.fileDropConfig} djsConfig={{params: {fileType: type}, ...this.djsConfig}} eventHandlers={this.djsEvents}/>
            </FieldWrapper>
        );
    }

    private renderTable(label: string, key: string, fields: Array<any>): JSX.Element {
        return <FormOptionsTable editable={false} fields={fields} formData={this.props.formData} formKey={key} modifyState={this.props.modifyState} options={this.props.formData[key]} renderInput={this.renderFromObjectKey}/>;
    }

    private renderInnerFormSection(value: object, key: string, label: string): JSX.Element {
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

    private renderFromObjectKey = (key: string, obj: Object, parentKey?: string): JSX.Element => {
        const value: any = obj[key].type;
        const label: string = obj[key].label;
        const options: Array<any> = obj[key].options;
        const fields: Array<any> = obj[key].fields;
        const fileType: string = obj[key].fileType;
        const pLabel: string = startCase(parentKey);
        const times: Array<object> = this.buildTimesList(2);

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
        return <></>;
    }

    public render(): JSX.Element {
        const {formScheme, id} = this.props;
        return(
            <FormWrapper id={id}>
                {Object.keys(formScheme).map(key => this.renderFromObjectKey(key, formScheme))}
            </FormWrapper>
        );
    }
}
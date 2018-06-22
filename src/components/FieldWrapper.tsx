import * as React from 'react';

export interface IFieldWrapperProps {id: string, label: string}

export class FieldWrapper extends React.Component<IFieldWrapperProps> {

    constructor(props: any) {
        super(props);
    }

    public render() {
        const {id, label, children} = this.props;
        return (
            <div className='form-group'>
                <label htmlFor={id}>{label}</label>
                {children}
            </div>
        );
    }
}
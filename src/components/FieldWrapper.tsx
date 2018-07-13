import * as React from 'react';

export interface IFieldWrapperProps {id: string, label: string}

export class FieldWrapper extends React.Component<IFieldWrapperProps> {

    constructor(props: IFieldWrapperProps) {
        super(props);
    }

    public render(): JSX.Element {
        const {id, label, children} = this.props;
        return (
            <div className='form-group'>
                <label htmlFor={id}>{label}</label>
                {children}
            </div>
        );
    }
}
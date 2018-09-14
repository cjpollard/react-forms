import * as React from 'react';

export interface IFormWrapperProps {id: string, submitLabel: string, handleFormSubmit: (e: any) => void}

export class FormWrapper extends React.Component<IFormWrapperProps> {

    constructor(props: IFormWrapperProps) {
        super(props);
    }

    public render(): JSX.Element {
        const {id, submitLabel, children, handleFormSubmit} = this.props;
        return (
            <form id={id} onSubmit={handleFormSubmit}>
                {children}
                <input type="submit" value={submitLabel}/>
            </form>
        );
    }
}
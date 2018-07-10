import * as React from 'react';

export interface IFormWrapperProps {id: string}

export class FormWrapper extends React.Component<IFormWrapperProps> {

    constructor(props: IFormWrapperProps) {
        super(props);
    }

    public render() {
        const {id, children} = this.props;
        return (
            <form id={id}>
                {children}
            </form>
        );
    }
}
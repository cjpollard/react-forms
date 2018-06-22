import * as React from 'react';
import DayPickerInput from 'react-day-picker';

export interface IDatePickerProps {
    onDayChange: (day: string, inputProps: object) => void,
    inputProps: any,
    placeholder: string,
    value?: string | Date,
    key?: string
}

export class DatePicker extends React.Component<IDatePickerProps> {

    constructor(props: any) {
        super(props);
    }

    private formatDate = (d: Date): string => {
        const year = d.getFullYear();
        const month = "" + (d.getMonth() + 1);
        const day = "" + d.getDate();
        return day + "-" + month + "-" + year;
    }

    private onDayChange = (day: string) => {
        this.props.onDayChange(day, this.props.inputProps);
    }

    private parseDate = (str: string): Date | void => {
        const split: Array<string> = str.split("-");
        if (split.length !== 3) {
            return undefined;
        }
        const day: number = parseInt(split[0], 10);
        const month: number = parseInt(split[1], 10) - 1;
        const year: number = parseInt(split[2], 10);
        if (day <= 0 || day > 31 || month < 0 || month >= 12) {
            return undefined;
        }

        return new Date(year, month, day);
    }

    render() {
        return (
            <DayPickerInput onDayChange={this.onDayChange} {...(this.props.value && {value: this.props.value})}
                formatDate={this.formatDate} parseDate={this.parseDate} placeholder={this.props.placeholder} inputProps={this.props.inputProps} />
        );
    }

}

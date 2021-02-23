// @flow
import * as React from 'react';
import {ChangeEventHandler, FormEventHandler, ReactChild} from 'react';

type FormProps = {
    fields: {
        label: string,
        type: 'text' | 'password' | 'textarea',
        value: string | number,
        onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>,
        errors: string[]
    }[],
    onSubmit: FormEventHandler,
    buttons: ReactChild[]
};
export const Form: React.FC<FormProps> = (props) => {
    const {fields, onSubmit, buttons} = props;
    return (
        <form onSubmit={onSubmit}>
            {
                fields.map((field, index) => <div key={index}>
                    <label>{field.label}{
                        field.type === 'textarea' ?
                            <textarea cols={30} rows={10} onChange={field.onChange}>{field.value}</textarea> :
                            <input type={field.type} value={field.value} onChange={field.onChange}/>
                    }</label>
                    {field.errors?.length > 0 && <div>{field.errors.join('\n')}</div>}
                </div>)
            }
            {
                buttons.map((button, index) => <div key={index}>{button}</div>)
            }
        </form>
    );
};
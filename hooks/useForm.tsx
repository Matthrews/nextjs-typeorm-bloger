// @flow 
import * as React from 'react';
import {ReactChild, useCallback, useState} from 'react';
import {AxiosResponse} from 'axios';

/**
 * field of a from
 */
type FormField<T> = {
    label: string;
    type: 'text' | 'password' | 'textarea';
    key: keyof T;
    className?: string;
}
/**
 * useForm options
 */
type useFormOptions<T> = {
    initFormData: T;
    fields: FormField<T>[];
    buttons: ReactChild[];
    submit: { request: (formData: T) => Promise<T>, success: () => void }
}

/**
 * 非受控From
 * @param options
 */
export function useForm<T>(options: useFormOptions<T>) {
    const {initFormData, fields, buttons, submit} = options;
    const [formData, setFormData] = useState(initFormData);
    const [errors, setErrors] = useState(() => {
        // let initErrors: { [key: string]: string[] } = {};  // 声明initErrors的键不是Symbol类型
        let initErrors: { [k in keyof T]?: string[] } = {};  // 另一种写法
        for (const key in formData) {
            if (formData.hasOwnProperty(key)) {
                initErrors[key] = [];
            }
        }
        return initErrors;
    });
    const onChange = useCallback((key: keyof T, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [key]: e.target.value
        });
    }, [formData]);

    const _onSubmit: (event: React.FormEvent<HTMLFormElement>) => void = useCallback((e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        submit.request(formData).then(() => {
            submit.success();
        }, (error) => {
            if (error.response) {
                const response: AxiosResponse = error.response;
                if (response.status === 422) {
                    // 422 Unprocessable Entity
                    // 422 请求格式正确，但是由于含有语义错误，无法响应。
                    // 可以理解为服务端能理解请求资源类型 content-type，否则应该返回 415（Unsupported Media Type），也能理解请求实体内容，
                    // 否则应该返回 400（Bad Request）
                    setErrors(response.data);
                } else if (response.status === 401) {
                    // 401未登录
                    // 403 未授权
                    window.alert('请先登录！');
                    window.location.href = `/sign_in?return_to=${encodeURIComponent(window.location.pathname)}`;
                }
            }
        });
    }, [formData, submit]);

    const form = <form onSubmit={_onSubmit}>
        {
            fields.map(({key, label, type, className}, index) => <div key={index} className={className}>
                <label><span>{label}</span>
                    {
                        type === 'textarea' ?
                            <textarea value={formData[key].toString()}
                                      onChange={(e) => onChange(key, e)}/> :
                            <input type={type} value={formData[key].toString()}
                                   onChange={(e) => onChange(key, e)}/>
                    }</label>
                {errors[key]?.length > 0 && <div>{errors[key].join('\n')}</div>}
            </div>)
        }
        <div>
            {
                buttons.map((button, index) => <span key={index}>{button}</span>)
            }
        </div>
    </form>;

    return {form};
}


// 受控组件：<input type="text" value={value} onChange={onChange}/> 自己操心数据变更 props
// 费受控组件：<input type="text" defaultValue={12} ref={inputRef}/> 组件搞定数据变更 state
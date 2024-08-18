import React from 'react';
import './Form.css';
import { useState } from 'react';

const Form = (props) => {
    const [value, setValue] = useState<number | string>('');

    return (
        <form className='form' onSubmit={e => {
                e.preventDefault();
                props.putTodo(value);
                setValue("");
            }
        }>
            <input type='text' maxLength={45} placeholder='Введите текст ...' className='input' value={value} onChange={e => setValue(e.target.value)} />

        </form>
    );
};

export default Form;
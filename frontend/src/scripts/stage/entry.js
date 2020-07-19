import React, {useState, useEffect} from 'react';
import { useForm } from 'react-hook-form';

export default function Entry(props) {
    const { register, handleSubmit } = useForm();

    const onSubmit = (data, event) => {
        // サーバーに'entry'を送信
        props.socket.emit('entry', {username : data.username});
        event.preventDefault(); // フォームによる/?への接続を止める(socketIDを一意に保つため)
    }

    return (
        <form className="form-inline" id="entryForm" onSubmit={ handleSubmit(onSubmit) }>
            <label className="sr-only" htmlFor="inlineFormInputName2">Name</label>
            <input type="text" className="form-control mb-2 mr-sm-2" id="userName" name="username" ref={ register } placeholder="名前を入力してください"/>
            <button type="submit" className="btn btn-primary mb-2">さんとしてゲームに参加</button>
        </form>
    );
}
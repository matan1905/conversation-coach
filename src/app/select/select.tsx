import React from 'react';
import ChatProduct from "@/app/select/chat-product";

function Select() {
    return (
        <div className={"flex flex-col items-center space-y-4 overflow-y-auto w-full"}>
            <span className={"text-3xl"}>Pick your settings</span>
        <ChatProduct/>
        <ChatProduct/>
        <ChatProduct/>
        </div>
    );
}

export default Select;
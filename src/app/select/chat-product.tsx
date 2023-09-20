import React from 'react';

function ChatProduct() {
    return (
        <div className={"p-2 flex flex-col items-center text-center hover:bg-gray-200 w-full cursor-pointer"}>
            <div className={"h-16 w-16 bg-red-600 rounded-full"}></div>
            <div className={"flex flex-col items-center"}>
                <div className={"text-xl"}>Unresponsive conversation on dating app</div>
                <div className={"text-xs text-gray-500 w-96 "}>Talk with a person who doesn't seem too interested, they will do their best to let the conversation die, but as long as you keep writing they will keep replying. dont give up! </div>
            </div>

        </div>
    );
}

export default ChatProduct;
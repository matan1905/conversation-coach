'use client'
import React, {ReactElement} from 'react';
import Avatar from "@/app/chat/avatar";
type MessageProps={
    byUser:boolean,
    body: string | ReactElement
}
function Message({body,byUser=true}:MessageProps) {
    return (
        <div className={"w-full items-center flex " +(byUser?" justify-self-start flex-row-reverse":"justify-self-end flex-row")}>
            <div>
                <Avatar name={byUser?"You":"AI"}/>

            </div>
            <div className=" mx-3 p-2 bg-gray-100 rounded-md">
                <p className="text-sm text-gray-900">
                    {body}
                </p>
            </div>

        </div>
    );
}

export default Message;


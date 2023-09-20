import React from 'react';


type AvatarProps ={
    name?:string,
    color?:string
}
function Avatar({name="AI",color="#ff9595"}:AvatarProps  ) {
    return (
        <div className={"rounded-full h-10 w-10 flex items-center justify-center"} style={{backgroundColor:color}}>
            <span className={"font-bold text-lg"}>{name}</span>
        </div>
    );
}

export default Avatar;
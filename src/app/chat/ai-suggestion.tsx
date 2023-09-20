import React from 'react';

function AiSuggestion({onClick, text}) {
    return (
        <div className={" py-1"}>

            <p onClick={onClick} className={"rounded-lg bg-cyan-500 cursor-pointer hover:bg-cyan-600 p-2"}>{text}</p>

        </div>
    );
}

export default AiSuggestion;
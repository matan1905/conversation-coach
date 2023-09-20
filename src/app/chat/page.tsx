'use client'

import Avatar from "@/app/chat/avatar";
import Chat from "@/app/chat/chat";
import ControlPanel from "@/app/chat/control-panel";

export default function Home() {
  return (
      <div className={"flex flex-row w-full h-full"}>
        {/*<ControlPanel/>*/}
        <Chat/>
      </div>


  )
}

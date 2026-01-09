
"use client";
import "@livekit/components-styles";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarMenuButton, SidebarHeader, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { LinkIcon, ScreenShareIcon, ScreenShareOffIcon, ShareIcon, TextIcon, XIcon } from "lucide-react";
import { GridLayout, LiveKitRoom, useLocalParticipant, useParticipantTracks, useRoomContext, useTracks, VideoConference, VideoTrack } from '@livekit/components-react';
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Track } from "livekit-client";
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { useTrackToggle } from "@livekit/components-react";
import { useRouter } from "next/navigation";

export default function PresentPage() {
    const [token, setToken] = useState('');
    const [state, setState] = useState<'waiting' | 'connecting' | 'connected' | 'disconnected'>('waiting');
    useEffect(() => {
        if (token != '') return
        fetch("/api/present").then(res => res.json()).then((res) => {
            setToken(res.token)
            setState('connecting')
        })
    }, [])
    return <>
        {(state !== 'waiting' && state !== 'disconnected') && <LiveKitRoomComponent token={token} state={state} setState={setState} />}
        {state == 'disconnected' && <Empty className="h-screen w-screen top-0 left-0 fixed gap-0">
            <EmptyMedia variant={"icon"}>
                <ScreenShareOffIcon />
            </EmptyMedia>
            <EmptyTitle>Presentation Ended</EmptyTitle>
            <EmptyDescription>Thank you for using DeskShare</EmptyDescription>
        </Empty>}
    </>
}

function LiveKitRoomComponent({ token, state, setState }: { token: string; state: 'waiting' | 'connecting' | 'connected' | 'disconnected'; setState: (state: 'waiting' | 'connecting' | 'connected' | 'disconnected') => void }) {
    const router = useRouter()
    return <LiveKitRoom
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL!}
        token={token}
        className="flex flex-1"
        onConnected={() => {
            setState('connected')
        }}
        onDisconnected={() => {
            setState('disconnected')
            setTimeout(() => {
                router.push("/")
            }, 5000)
        }}
    >
        <LiveKitMain state={state} />
    </LiveKitRoom>
}

function LiveKitMain({ state }: { state: 'waiting' | 'connecting' | 'connected' | 'disconnected' }) {
    const room = useRoomContext()
    const tracks = useTracks([
        { source: Track.Source.ScreenShare, withPlaceholder: false }
    ]);
    var { toggle: toggleScreenShare, enabled: screenShareEnabled } = useTrackToggle({ source: Track.Source.ScreenShare });
    return <SidebarProvider className="flex flex-row fixed w-screen h-screen top-0 left-0">
        <SidebarTrigger className="sidebartrigger" />
        <Sidebar>
            <SidebarContent className="gap-0">
                <SidebarHeader className="p-4 pb-2">
                    <h1 className="text-lg text-muted-foreground">DeskShare</h1>
                </SidebarHeader>
                <SidebarGroup>
                    <SidebarGroupLabel>Controls</SidebarGroupLabel>
                    <SidebarMenuButton onClick={() => { room.disconnect() }}>
                        <XIcon /> End Presentation
                    </SidebarMenuButton>
                    <SidebarMenuButton disabled={state !== 'connected'} onClick={() => toggleScreenShare()}>
                        {screenShareEnabled ? <ScreenShareOffIcon /> : <ScreenShareIcon />} {screenShareEnabled ? 'Stop' : 'Start'} Screen Share
                    </SidebarMenuButton>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Viewers</SidebarGroupLabel>
                    <SidebarMenuButton onClick={() => {
                        window.navigator.clipboard.writeText(window.location.origin + "/view/" + room.name)
                    }}>
                        <LinkIcon /> Share Link
                    </SidebarMenuButton>
                    <SidebarMenuButton disabled>
                        <TextIcon /> <span style={{ userSelect: "none" }}>Room Code:</span> <span style={{ userSelect: "all" }}>{room.name}</span>
                    </SidebarMenuButton>
                </SidebarGroup>

            </SidebarContent>
        </Sidebar>
        {tracks.length > 0 ? <GridLayout className="m-4" style={{ height: 'calc(100% - 32px)' }} tracks={tracks} >
            <div className="rounded-lg border-1 bg-black"><VideoTrack /></div>
        </GridLayout> : <div className="text-muted-foreground w-full h-full flex items-center justify-center">
            <Empty className="gap-0">
                <EmptyMedia className="border-1" variant={"icon"} >
                    <ShareIcon className="m-4" />
                </EmptyMedia>
                <EmptyTitle>Not sharing screen</EmptyTitle>
                <EmptyDescription>
                    No screen is being shared
                </EmptyDescription>
            </Empty>
        </div>}
    </SidebarProvider>
}
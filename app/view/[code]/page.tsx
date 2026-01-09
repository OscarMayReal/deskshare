
"use client";
import "@livekit/components-styles";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarMenuButton, SidebarHeader, SidebarProvider } from "@/components/ui/sidebar";
import { LinkIcon, ScreenShareOffIcon, ShareIcon, XIcon } from "lucide-react";
import { GridLayout, LiveKitRoom, useLocalParticipant, useParticipants, useParticipantTracks, useRoomContext, useTracks, VideoConference, VideoTrack } from '@livekit/components-react';
import { Usable, use, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ConnectionState, Participant, Track } from "livekit-client";
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { useTrackToggle } from "@livekit/components-react";
import { useRouter } from "next/navigation";

export default function PresentPage({ params }: { params: Usable<{ code: string }> }) {
    const { code } = use(params)
    const [token, setToken] = useState('');
    const [state, setState] = useState<'waiting' | 'connecting' | 'connected' | 'disconnected'>('waiting');
    useEffect(() => {
        if (token != '' || !code) return
        fetch("/api/view/" + code).then(res => res.json()).then((res) => {
            setToken(res.token)
            setState('connecting')
        })
    }, [code, token])
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
    const paritcipants = useParticipants()
    useEffect(() => {
        if (!paritcipants) return
        console.log(paritcipants)
        if (paritcipants.filter(p => p.attributes.admin == "true").length == 0 && paritcipants.length !== 0 && room.state == ConnectionState.Connected) {
            room.disconnect()
        }
    }, [paritcipants])
    const tracks = useTracks([
        { source: Track.Source.ScreenShare, withPlaceholder: false }
    ]);
    return <div className="flex fixed flex-col w-screen h-screen top-0 left-0">
        <div className="flex flex-row w-full items-center" style={{
            height: 60,
            minHeight: 60,
            maxHeight: 60
        }}>
            <div className="text-lg text-muted-foreground" style={{
                marginLeft: 16
            }}>
                DeskShare
            </div>
            <div className="flex-1" />
            <Button onClick={() => {
                room.disconnect()
            }} variant={"outline"} size={"sm"} style={{
                marginRight: 16
            }}><XIcon />Leave Presentation</Button>
        </div>
        {tracks.length > 0 ? <GridLayout className="m-4" style={{ height: 'calc(100% - 16px - 60px)', width: "calc(100% - 32px)", marginTop: 0 }} tracks={tracks} >
            <div className="rounded-lg border-1 bg-black"><VideoTrack /></div>
        </GridLayout> : <div className="text-muted-foreground flex-1 flex items-center justify-center">
            <Empty className="gap-0">
                <EmptyMedia className="border-1" variant={"icon"} >
                    <ScreenShareOffIcon className="m-4" />
                </EmptyMedia>
                <EmptyTitle>Host not sharing screen</EmptyTitle>
                <EmptyDescription>
                    The host is not currently sharing their screen
                </EmptyDescription>
            </Empty>
        </div>}
    </div>
}
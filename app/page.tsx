"use client";
import { Button } from "@/components/ui/button";
import { EyeIcon, ShareIcon, XIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { AuthState, useAuth } from "keystone-lib";
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
    const auth = useAuth({ appId: process.env.NEXT_PUBLIC_APP_ID!, keystoneUrl: process.env.NEXT_PUBLIC_KEYSTONE_URL! });
    return <div className="fixed top-0 left-0 flex flex-col items-center justify-center gap-4 h-screen w-screen relative">
        {auth?.data?.user && <a href={"https://keystone.qplus.cloud/account"} target="_blank" className="text-muted-foreground absolute top-4 right-6 hover:underline cursor-pointer">You are signed in as {auth.data.user.name}</a>}
        {auth?.data?.user && auth?.data?.tenant && <p className="text-muted-foreground absolute top-4 left-6">{auth.data.tenant.displayName || auth.data.tenant.name}</p>}
        <h1 className="text-lg">DeskShare<span className="text-muted-foreground"> - Simple, free screen sharing</span></h1>
        <div className="flex flex-row gap-4">
            <PresentDialog auth={auth} />
            <ViewDialog />
        </div>
        <WhyDialog />
    </div>;
}

function ViewDialog() {
    const [code, setCode] = useState("")
    const router = useRouter()
    return <Dialog>
        <DialogTrigger>
            <Tooltip>
                <TooltipTrigger asChild><Button variant="outline" className="w-[150px] text-muted-foreground"><EyeIcon />View</Button></TooltipTrigger>
                <TooltipContent>View a presentation</TooltipContent>
            </Tooltip>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>View Presentation</DialogTitle>
                <DialogDescription>
                    Enter the presentation code to view it
                </DialogDescription>
            </DialogHeader>
            <Input placeholder="Enter presentation code" value={code} onChange={(e) => setCode(e.target.value)} />
            <DialogFooter>
                <DialogClose asChild>
                    <Button className="text-muted-foreground" variant="outline"><XIcon />Close</Button>
                </DialogClose>
                <Button onClick={() => router.push("/view/" + code)}><EyeIcon />View</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
}

function PresentDialog({ auth }: { auth: AuthState }) {
    return <Dialog>
        <DialogTrigger>
            <Tooltip>
                <TooltipTrigger asChild><Button variant="outline" className="w-[150px] text-muted-foreground"><ShareIcon />Present</Button></TooltipTrigger>
                <TooltipContent>Present your screen to others</TooltipContent>
            </Tooltip>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Present</DialogTitle>
                <DialogDescription>
                    Present your screen to others
                </DialogDescription>
            </DialogHeader>
            {!auth?.data?.user ? <p className="text-muted-foreground">You are not signed in. If you expect you should be, sign in at <a className="hover:underline cursor-pointer text-blue-700" href={"https://keystoneapi.qplus.cloud/auth/signin?redirectTo=" + encodeURIComponent("https://deskshare.qplus.cloud/")}>Quntem KeyStone</a></p> : <div><p className="text-muted-foreground pb-3">You are presenting as:</p><Item variant={"outline"}>
                <ItemMedia>
                    <Avatar className={"mt-0.5"}>
                        <AvatarFallback>{auth?.data?.user?.name?.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                </ItemMedia>
                <ItemContent className={"gap-0"}>
                    <ItemTitle>{auth?.data?.user?.name}</ItemTitle>
                    <ItemDescription>{auth?.data?.user?.email}</ItemDescription>
                </ItemContent>
            </Item></div>}
            <DialogFooter>
                <DialogClose asChild>
                    <Button className="text-muted-foreground" variant="outline"><XIcon />Close</Button>
                </DialogClose>
                <Link href="/present"><Button><ShareIcon />Present</Button></Link>
            </DialogFooter>
        </DialogContent>
    </Dialog>
}

function WhyDialog() {
    return <Dialog>
        <span className="text-muted-foreground text-center">A free service - <DialogTrigger><p className="hover:underline cursor-pointer">Learn more</p></DialogTrigger>.<br />Open Source - <a href="https://github.com/oscarmayreal/deskshare" className="hover:underline cursor-pointer">GitHub</a>.<br />Developed by <a href="https://github.com/oscarmayreal" className="hover:underline cursor-pointer">Oscar May</a></span>
        <DialogContent>
            <DialogHeader className="hidden">
                <DialogTitle>Why DeskShare?</DialogTitle>
            </DialogHeader>
            <article className="prose">
                <h3>Why DeskShare?</h3>
                <p>There were no other services that allowed you to share your screen as easily as DeskShare.</p>
                <p>DeskShare is a free service that allows you to share your screen with others. It is a simple way to share your screen with others.</p>
                <h4>How it works</h4>
                <p>Using DeskShare is free and easy. You can share your screen with others by simply clicking the "<ShareIcon className="inline" size={14} /> Present" button, and either sending the link to them or having them click the "<EyeIcon className="inline" size={14} /> View" button and enter the code.</p>
                <h4>Quntem accounts</h4>
                <p>A Quntem account is optional, but allows you to show your user info to viewers. DeskShare only supports managed Quntem accounts. </p>
                <p>You will know you are signed in when you see your organization name at the top left of the page.</p>
            </article>
        </DialogContent>
    </Dialog>
}
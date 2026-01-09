import { randomUUID } from "crypto";
import { VerifySession } from "keystone-lib"
import { AccessToken } from 'livekit-server-sdk';
import { NextResponse } from "next/server";

export async function GET() {
    const roomname = (Math.random() * 10000000).toFixed(0);
    const token = new AccessToken(process.env.LIVEKIT_API_KEY!, process.env.LIVEKIT_API_SECRET!, {
        identity: JSON.stringify({
            "name": "anonymous",
            "email": null,
            "id": randomUUID() + new Date().toISOString()
        }),
        attributes: {
            admin: "true"
        }
    });
    token.addGrant({
        roomJoin: true,
        room: roomname,
        canPublish: true
    })
    const jwt = await token.toJwt()
    return NextResponse.json({
        token: jwt
    })
}
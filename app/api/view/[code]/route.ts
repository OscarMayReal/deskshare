import { randomUUID } from "crypto";
import { VerifySession } from "keystone-lib"
import { AccessToken } from 'livekit-server-sdk';
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export async function GET(req: NextApiRequest, { params }: { params: Promise<{ code: string }> }) {
    const token = new AccessToken(process.env.LIVEKIT_API_KEY!, process.env.LIVEKIT_API_SECRET!, {
        identity: JSON.stringify({
            "name": "anonymous",
            "email": null,
            "id": randomUUID() + new Date().toISOString()
        }),
    });
    const { code } = await params
    token.addGrant({
        roomJoin: true,
        room: code,
        canPublish: false,
        canSubscribe: true
    })
    const jwt = await token.toJwt()
    return NextResponse.json({
        token: jwt
    })
}
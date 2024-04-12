import { createController } from '@/controllers/createController';
import { NextResponse } from "next/server"

export const POST = async (request) => {
    try {
        return await createController(request);
    } catch (error) {
        return NextResponse.json({error: error.message},{status: 500});
    }
}
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function PUT (
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        const { userId } = auth();
        const { list } = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const courseOwner = await prisma.course.findUnique({
            where: {
                id: params.courseId,
                userId
            }
        });

        if (!courseOwner) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        for (let item of list) {
            await prisma.chapter.update({
                where: {
                    id: item.id
                },
                data: {
                    position: item.position
                }
            });
        };

        return new NextResponse("Success", { status: 200 });

    } catch (error) {
        console.log("[REORDER]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
};
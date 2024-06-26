import { Course, Category } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { getProgress } from "./get-progess";

type CourseWithProgressWithCategory = Course & {
    category: Category | null;
    chapters: { id: string }[];
    progress: number | null;
};

type GetCourses = {
    userId: string;
    categoryId?: string;
    title?: string;
}

export const getCourses = async ({
    userId,
    categoryId,
    title
}: GetCourses): Promise<CourseWithProgressWithCategory[]> => {
    try {
        const courses = await prisma.course.findMany({
            where: {
                isPublished: true,
                title: {
                    contains: title
                }
            },
            include: {
                category: true,
                chapters: {
                    where: {
                        isPublished: true
                    },
                    select: {
                        id: true
                    }
                },
                purchases: {
                    where: {
                        userId
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        const coursesWithProgress: CourseWithProgressWithCategory[] = await Promise.all(courses.map(async course => {
            if (course.purchases.length === 0) {
                return {
                    ...course,
                    progress: null
                }
            }

            const progressPercentage = await getProgress(userId, course.id);

            return {
                ...course,
                progress: progressPercentage
            }
        }));

        return coursesWithProgress;

    } catch (error) {
        console.log("GET_COURSES", error);
        return [];
    }
};
import { getOrganisations, getTasks } from "@/api";



export async function getParsedTasks(orgId) {
    try {
        const [rawTasks, organisations] = await Promise.all([
            getTasks(orgId),
            getOrganisations(),
        ]);

        if (!rawTasks || typeof rawTasks !== "object") return [];

        return Object.entries(rawTasks).map(([key, task]) => {
            const orgId = task.meta?.orgId;
            const org = organisations.find(org => org.id === orgId) || {};

            const getBlock = (type) =>
                task.blockContent.main?.blocks?.find((b) => b.type === type) ||
                task.blockContent.sidebar?.blocks?.find((b) => b.type === type);

            const stripHtml = (html) => html?.replace(/<\/?[^>]+(>|$)/g, "") || "";
            const getDescription = () => {
                const teaserBlock = task.blockContent.main?.blocks?.find((b) => b.type === "taskTeaser") ||
                    task.blockContent.sidebar?.blocks?.find((b) => b.type === "taskTeaser");
                if (teaserBlock) return stripHtml(teaserBlock.data?.text);

                const paragraphBlock = task.blockContent.main?.blocks?.find((b) => b.type === "paragraph") ||
                    task.blockContent.sidebar?.blocks?.find((b) => b.type === "paragraph");
                return stripHtml(paragraphBlock?.data?.text);
            };

            return {
                id: key,
                image: getBlock("image")?.data?.file?.url || null,
                title: task?.meta?.title,
                description: getDescription(),
                tags: getBlock("tags")?.data?.tags || [],
                tagLink: getBlock("tags")?.data?.link || null,
                taskSites: {
                    isRemote: getBlock("taskSites")?.data?.isRemote || false,
                    isChanging: getBlock("taskSites")?.data?.isChanging || false,
                    sites: getBlock("taskSites")?.data?.sites || [],
                },
                temporalDemand: {
                    durationType: getBlock("temporalDemand")?.data?.durationType,
                    scheduleType: getBlock("temporalDemand")?.data?.scheduleType,
                },
                workTypeAndDemand: {
                    isUrgent: getBlock("workTypeAndDemand")?.data?.isUrgent,
                    workTypes: getBlock("workTypeAndDemand")?.data?.workTypes,
                },
                organisation: {
                    name: org.name || null,
                    slug: org.slug || null,
                    logo: org.logo || null,
                    id: task.meta?.orgId || null,
                },
            };
        });
    } catch (err) {
        console.error("getParsedTasks ", err);
        return [];
    }
}

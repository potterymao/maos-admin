// server/utils/shopline.ts
export const callShoplineAPI = async (path: string, options: any = {}) => {
    const config = useRuntimeConfig();
    const targetUrl = `https://open.shopline.io/v1/${path}`;

    return await $fetch(targetUrl, {
        ...options,
        headers: {
            'Authorization': `Bearer ${config.shoplineAccessKey}`,
            'Content-Type': 'application/json',
            ...options.headers
        }
    });
};
// server/api/shopline/[...path].ts
export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const path = event.context.params?.path; // 取得 shopline/ 後面的完整路徑
    const method = getMethod(event); // 取得前端傳來的 GET 或 POST
    console.log('🚀 Bridge Triggered:', path);

    // 組合真正的 Shopline API 網址
    const targetUrl = `${config.public.shoplineApi}${path}`;
    console.log('🚀 Target URL:', targetUrl);
    try {
        // 讀取前端傳來的 Body (僅限 POST/PUT)
        let body = null;
        if (method !== 'GET') {
            body = await readBody(event);
        }

        // 執行轉發
        const response = await $fetch(targetUrl, {
            method: method,
            headers: {
                'Authorization': `Bearer ${config.public.shoplineAccessKey}`,
                'Content-Type': 'application/json'
            },
            body: body,
            // 如果是 GET 請求，自動把前端的 Query Params 帶過去
            query: getQuery(event)
        });

        return response;
    } catch (err: any) {
        console.error('Shopline API 詳細錯誤:', err.data || err);

        throw createError({
            statusCode: err.response?.status || 500,
            statusMessage: 'Shopline API Bridge Error',
            data: err.data
        });
    }
});
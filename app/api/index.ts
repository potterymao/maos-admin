
// Get image data as blob and convert to object URL for preview
export async function GetImage(url: string) {
  try {
    // 呼叫我們寫好的 Server API Proxy
    const response = await $fetch<any>(url, {
      method: 'GET',
    })

    const blob = response;
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (err: any) {
    console.error('Store fetchPatterns Error:', err)
  } finally {
  }
}

export async function AddToCart(addData: any) {
  const config = useRuntimeConfig()
  const merchantId = config.public.shoplineMerchantId
  try {
    const response = await $fetch<any>('/api/shopline/merchants/generate_express_link', {
      method: 'POST',
      body: { "affiliate_campaign_id": merchantId, "products": addData }
    })

    return response;
  } catch (err: any) {
    console.error('AddToCart Error:', err);
    throw err;
  }
}


export async function GetExchangeCart() {
  
  try {
  } catch (err: any) {
  }
}
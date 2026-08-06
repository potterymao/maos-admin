
// Get image data as blob and convert to object URL for preview
export async function GetImage(url: string) {
  try {
    // 呼叫我們寫好的 Server API Proxy
    const response = await $fetch.raw(url, {
      method: 'GET',
    })

    // const cookies = response.headers.getSetCookie()
    // console.log('获取到的外部域名 Cookie:', cookies)

    const blob = response._data as Blob;
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
    // console.log('获取到的外部域名 response:', response)
    // const cookies = response.headers.getSetCookie()
    // console.log('获取到的外部域名 Cookie:', cookies)
    return response;
  } catch (err: any) {
    console.error('AddToCart Error:', err);
    throw err;
  }
}

// Get Cart ID
export async function GetCartId(id: string) {
  try {
    const response = await  $fetch<any>(`/api/shopline/carts/find`, {
      credentials: 'include',
      method: 'GET',
      query: { 'owner_id': id, 'owner_type': 'Guest' }
    })

    return response.data.cart_id;
  } catch (err: any) {
    console.error('AddToCart Error:', err);
    throw err;
  }
}

// Get Cart
export async function GetCart(id: string) {
  try {
    const response = await $fetch<any>(`/api/shopline/carts/${id}`, {
      method: 'GET',
    })

    return response.data;
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
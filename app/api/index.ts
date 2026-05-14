// import error from "#build/ui/error";

// const getPlateFields = ref(["items.id", "items.title_translations", "items.lowest_price", "items.medias"]);
// const getPatternFields = ref(["items.id", "items.title_translations", "items.lowest_price"]);
// export const useFetchPatterns = () => {
// export async function useFetchPatterns() {
//   // const designStore = useDesignStore();
//   // const { data, pending, error } = useAsyncData('user', () => $fetch('/api/user'))
//   const { data, pending, error } = useFetch<any>(`${BASE_URL}/products/search`, {
//     method: "GET",
//     query: {
//       category_id: pattern_id,
//     },
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${auth_token}`,
//     },
//   });
//   if (data.value) {

//   }

//   // if (data.value) designStore.SetPatterns(data.value);
//   // return { pending, error };
// }

// export async function GetPlates() {
//   // const { data, error } = await useFetch<any>(`${BASE_URL}/products/search`, {
//   //   method: 'post',
//   //   query: {
//   //     category_id: plate_id,
//   //   }
//   // });
//   // if (error.value) {
//   //   console.error("Error fetching patterns:", error.value);
//   //   throw new Error("Failed to fetch patterns");
//   // }
//   // return data.value;
//   try {
//     const data = await $fetch('/api/shopline/products/search', {
//       method: 'POST',
//       query: {
//         category_id: plate_id,
//       }
//     });

//     return data;
//   } catch (error) {
//     console.error('GetPlates Error:', error);
//     throw error;
//   }
// }

// export async function GetPatterns() {
//   // try {
//   // const response = await $fetch<any>(`${BASE_URL}/products/search`, {
//   const { data, error } = await useFetch<any>('/api/shopline/products/search', {
//     method: "GET",
//     query: {
//       category_id: pattern_id,
//     },
//     // headers: {
//     //   Authorization: `Bearer ${auth_token}`,
//     // },
//   });
//   //   return response;
//   // } catch (err) {
//   //   console.error("Error fetching patterns:", err);
//   //   throw new Error("Failed to fetch patterns");
//   // }
//   if (error.value) {
//     console.error("Error fetching patterns:", error.value);
//     throw new Error("Failed to fetch patterns");
//   }
//   // designStore.SetPatterns(data.value);
//   return data.value;
// }

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
  // const { data, error } = await useFetch<any>(url, {
  //   method: "GET",
  // });
  // if (error.value) {
  //   console.error("Error fetching patterns:", error.value);
  //   throw new Error("Failed to fetch patterns");
  // }
  // const blob = data.value;
  // return new Promise((resolve, reject) => {
  //   const reader = new FileReader();
  //   reader.onloadend = () => resolve(reader.result);
  //   reader.onerror = reject;
  //   reader.readAsDataURL(blob);
  // });
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
  // const { data, error } = await useFetch<any>(`${BASE_URL}/merchants/generate_express_link`, {
  //   method: "POST",
  //   body: {
  //     "affiliate_campaign_id": merchant_id,
  //     "products": addData
  //   }
  // });

  // if (error.value) {
  //   console.error("Error fetching patterns:", error.value);
  //   throw new Error("Failed to fetch patterns");
  // }
  // return data.value;
}

// import error from "#build/ui/error";

const BASE_URL = "https://open.shopline.io/v1";
const auth_token = "2f02e2666086ad2bfe21a1ecaff1d6ffbfef1acdb377206570a70275deb6e929";
const plate_id = "69a91f41436917d8cc011bac";
const pattern_id = "69a91f9a1936bba5ce715660";

// const getPlateFields = ref(["items.id", "items.title_translations", "items.lowest_price", "items.medias"]);
// const getPatternFields = ref(["items.id", "items.title_translations", "items.lowest_price"]);

export async function GetPlates() {
  // try {
  const { data, error } = await useFetch<any>(`${BASE_URL}/products/search`, {
    // const response = await $fetch<any>(`${BASE_URL}/products/search`, {
    // method: 'GET',
    query: {
      category_id: plate_id,
    },
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth_token}`,
    },
  });
  //   return response;
  // } catch (err) {
  //   console.error("Error fetching plates:", err);
  //   throw new Error("Failed to fetch plates");
  // }
  if (error.value) {
    console.error("Error fetching patterns:", error.value);
    throw new Error("Failed to fetch patterns");
  }
  return data.value;
}

export async function GetPatterns() {
  // try {
  // const response = await $fetch<any>(`${BASE_URL}/products/search`, {
  const { data, error } = await useFetch<any>(`${BASE_URL}/products/search`, {
    method: "GET",
    query: {
      category_id: pattern_id,
    },
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth_token}`,
    },
  });
  //   return response;
  // } catch (err) {
  //   console.error("Error fetching patterns:", err);
  //   throw new Error("Failed to fetch patterns");
  // }
  if (error.value) {
    console.error("Error fetching patterns:", error.value);
    throw new Error("Failed to fetch patterns");
  }
  return data.value;
}

// Get image data as blob and convert to object URL for preview
export async function GetImage(url: string) {
  const { data, error } = await useFetch<any>(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth_token}`,
    },
  });
  if (error.value) {
    console.error("Error fetching patterns:", error.value);
    throw new Error("Failed to fetch patterns");
  }
  const blob = data.value
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

export async function AddToCart() {
  // const { data, error } = await useFetch<any>(`${BASE_URL}/storefront-api/v1/carts/{cart_id}/items`, {
  const { data, error } = await useFetch<any>(`${BASE_URL}/carts/{cart_id}/items`, {
    method: "POST",
    query: {
      category_id: pattern_id,
    },
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth_token}`,
    },
  });

  if (error.value) {
    console.error("Error fetching patterns:", error.value);
    throw new Error("Failed to fetch patterns");
  }
  return data.value;
}
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

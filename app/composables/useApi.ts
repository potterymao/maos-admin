const BASE_URL = "https://open.shopline.io/v1/";
const auth_token = "2f02e2666086ad2bfe21a1ecaff1d6ffbfef1acdb377206570a70275deb6e929";
// const pattern_id = "69a91f9a1936bba5ce715660";

// export async function GetPatterns() {
//   return await useFetch(`${BASE_URL}/products/search/${pattern_id}`, {
//     query: {
//       category_id: pattern_id,
//     },
//     headers: {
//       Accept: "application/json",
//       Authorization: `Bearer ${auth_token}`,
//     },
//   });
// }

import { api } from '@/api';

export const useApi = () => {
  const loading = ref(false);
  const error = ref(null);

  const handleApiCall = async (apiCall: any) => {
    loading.value = true;
    error.value = null;

    try {
      const result = await apiCall();
      return result;
    } catch (err: any) {
      error.value = err.message || "API调用失败";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 为每个API方法包装loading和error处理
  const posts = {
    getPosts: (params: any) => handleApiCall(() => api.posts.getPosts(params)),
    getPost: (id: string) => handleApiCall(() => api.posts.getPost(id)),
    createPost: (data: any) => handleApiCall(() => api.posts.createPost(data)),
    updatePost: (id: string, data: any) => handleApiCall(() => api.posts.updatePost(id, data)),
    deletePost: (id: string) => handleApiCall(() => api.posts.deletePost(id)),
  };

  const users = {
    getUsers: () => handleApiCall(() => api.users.getUsers()),
    getUser: (id: any) => handleApiCall(() => api.users.getUser(id)),
    getUserPosts: (userId: string) => handleApiCall(() => api.users.getUserPosts(userId)),
  };

  const todos = {
    getTodos: (params: any) => handleApiCall(() => api.todos.getTodos(params)),
    updateTodo: (id: string, data: any) => handleApiCall(() => api.todos.updateTodo(id, data)),
  };

//   return {
//     posts,
//     users,
//     todos,
//     loading: readonly(loading),
//     error: readonly(error),
//   };
};

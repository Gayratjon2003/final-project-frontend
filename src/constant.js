export const SERVER_URL = "http://localhost:5000/";
// export const SERVER_URL = "https://final-project-4lp9.onrender.com/";
export const LOGIN_URL = `${SERVER_URL}api/auth`;
export const REGISTER_URL = `${SERVER_URL}api/users`;
export const GET_USER_INFO_URL = `${SERVER_URL}api/users/me`;
export const GET_ITEMS = `${SERVER_URL}api/items`;
export const GET_ITEMS_ADMIN = `${SERVER_URL}api/items/all`;
export const GET_USERS = `${SERVER_URL}api/users`;
export const GET_TAGS = `${SERVER_URL}api/items/tags`;
export const GET_COLLECTION = `${SERVER_URL}api/collections`;
export const GET_COLLECTIONS = `${SERVER_URL}api/collections/all`;
export const GET_LATEST_ITEMS = `${SERVER_URL}api/items/latest`;
export const GET_LATEST_COLLECTIONS = `${SERVER_URL}api/collections/latest`;
export const GET_LIKE = `${SERVER_URL}api/like`;
export const GET_CATEGORIES = `${SERVER_URL}api/categories`;
export const SEND_COMMENT = `${SERVER_URL}api/comment`;

export const routes = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  ITEM_ID: "/item/:id",
  SEARCH_RESULT: "/search/:id",
  COLLECTION_ID: "/collection/:id",
  ALL_ITEMS: "/items/all",
  ALL_COLLECTIONS: "/collections/all",
  DASHBOARD: {
    HOME: "/dashboard",
    USERS: "/dashboard/users",
    CATEGORIES: "/dashboard/categories",
    COLLECTIONS: "/dashboard/collections",
    ITEMS: "/dashboard/items",
  },
};

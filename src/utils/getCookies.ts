import Cookies from "cookies";

const getCookies = (cookies: Cookies) => {
  // Get the user id from the cookies
  const userId = cookies.get("gallerize-user-id");
  const userWeight = cookies.get("gallerize-user-id-weight");

  if (isNaN(Number(userWeight))) {
    //@ts-ignore
    cookies.set("gallerize-user-id-weight", "1", { expires: 365 });
  }

  return { userId, userWeight };
};

export default getCookies;

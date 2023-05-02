import Cookies from "cookies";

const getCookiesServer = (cookies: Cookies) => {
  // Get the user id from the cookies
  const userId = cookies.get("gallerize-user-id");
  const userWeight = cookies.get("gallerize-user-id-weight");
  const selectedConcept = cookies.get("gallerize-selected-concept");

  if (isNaN(Number(userWeight))) {
    //@ts-ignore
    cookies.set("gallerize-user-id-weight", "1", {
      expires: new Date(Date.now() + 1000 * 60 * 10), // 10 minutes
    });
  }

  return { userId, userWeight, selectedConcept };
};

export default getCookiesServer;

import cuid from "cuid";
//@ts-ignore
import cookieCutter from "cookie-cutter";

const getUserCookies = () => {
  let userId = cookieCutter.get("gallerize-user-id");
  let userWeight = cookieCutter.get("gallerize-user-id-weight");
  let selectedConcept = cookieCutter.get("gallerize-selected-concept");

  if (!userId) {
    cookieCutter.set("gallerize-user-id", cuid(), {
      expires: new Date(Date.now() + 1000 * 60 * 10), // 10 minutes
    });
  }

  if (isNaN(Number(userWeight)) || !userWeight) {
    cookieCutter.set("gallerize-user-id-weight", "1", {
      expires: new Date(Date.now() + 1000 * 60 * 10), // 10 minutes
    });
  }

  userId = cookieCutter.get("gallerize-user-id");
  userWeight = cookieCutter.get("gallerize-user-id-weight");

  return { userId, userWeight, selectedConcept };
};

export const clearUserCookies = () => {
  cookieCutter.set("gallerize-user-id", "");
  cookieCutter.set("gallerize-user-id-weight", "");
  cookieCutter.set("gallerize-selected-concept", "XD");
};

export default getUserCookies;

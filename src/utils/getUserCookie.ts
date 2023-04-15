import cuid from "cuid";
//@ts-ignore
import cookieCutter from "cookie-cutter";

const getUserCookies = () => {
  let userId = cookieCutter.get("gallerize-user-id");
  let userWeight = cookieCutter.get("gallerize-user-id-weight");

  if (!userId) {
    cookieCutter.set("gallerize-user-id", cuid(), { expires: 365 });
  }

  if (isNaN(Number(userWeight)) || !userWeight) {
    cookieCutter.set("gallerize-user-id-weight", "1", { expires: 365 });
  }

  userId = cookieCutter.get("gallerize-user-id");
  userWeight = cookieCutter.get("gallerize-user-id-weight");

  return { userId, userWeight };
};

export default getUserCookies;

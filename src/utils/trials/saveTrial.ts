import { RandomImage } from "@/types/Image";
import getUserCookies from "@/utils/getUserCookie";
import moment from "moment";

type Clicks = {
  loadTime: number;
  firstClick: number;
};

export const saveTrial = async (
  clicks: Clicks,
  randomImages: RandomImage[],
  markedImagesIds: number[]
) => {
  const { userId, userWeight } = getUserCookies();

  const { loadTime, firstClick } = clicks;

  let firstClickTime: number;

  if (firstClick === 0) {
    firstClickTime = 0;
  } else {
    firstClickTime = moment(firstClick).diff(moment(loadTime));
  }

  const lastClickTime = moment().diff(moment(loadTime));

  // Transform to the format that the backend expects
  const images = randomImages.map((image, i) => {
    if (markedImagesIds.includes(i)) {
      return {
        imageId: image.id,
        valid: image.valid,
        selected: true,
      };
    } else {
      return {
        imageId: image.id,
        valid: image.valid,
        selected: false,
      };
    }
  });

  const headers = {
    "Content-Type": "application/json",
    cookie: `user-id=${userId}, gallerize-user-id-weight=${userWeight}'`,
  };

  const trial = {
    userId,
    firstClickTime,
    lastClickTime,
    images,
  };

  await fetch(`/api/trial/save-history`, {
    method: "POST",
    headers,
    body: JSON.stringify(trial),
  });

  return;
};

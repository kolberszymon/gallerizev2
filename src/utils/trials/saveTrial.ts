import { RandomImage } from "@/types/Image";
import getUserCookies from "@/utils/common/getUserCookie";
import moment from "moment";
import { Concepts } from "@/types/Concepts";

type Clicks = {
  loadTime: number;
  firstClick: number;
};

export const saveTrial = async (
  clicks: Clicks,
  randomImages: RandomImage[],
  concepts: Concepts
) => {
  const { userId, userWeight } = getUserCookies();

  const { loadTime, firstClick } = clicks;

  let firstClickTime: number;

  if (firstClick === 0) {
    firstClickTime = 0;
  } else {
    firstClickTime = moment(firstClick).diff(moment(loadTime));
  }

  const markedImagesIds = randomImages
    .map((image, i) => {
      if (image.selected) {
        return i;
      }
    })
    .filter((i) => i);

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
    concepts,
  };

  console.log(trial);

  await fetch(`/api/trial/save-history-mongo-db`, {
    method: "POST",
    headers,
    body: JSON.stringify(trial),
  });

  return;
};

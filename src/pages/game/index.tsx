import type { NextPage } from "next";
import DoodleButton from "@/components/DoodleButton";
import Image from "next/image";
import { ReactNode, useEffect, useState } from "react";
import getUserCookies from "@/utils/getUserCookie";
import { RandomImage } from "@/types/Image";
import { saveAnswer } from "@/utils/trials/saveAnswer";
import { saveTrial } from "@/utils/trials/saveTrial";
import moment from "moment";
import { colorResponse } from "@/utils/colorResponse";
import { Concepts } from "@/types/Concepts";
import { BackgroundColor } from "@/types/BackgroundColors";
import { motion } from "framer-motion";
import Chance from "chance";
import {
  incorrectResponses,
  correctResponses,
} from "@/utils/feedbackResponses";

const chance = new Chance();

const Game: NextPage = () => {
  const [fetchedImages, setFetchedImages] = useState<RandomImage[]>([]);
  const [bgColor, setBgColor] = useState<BackgroundColor>("bg-white");
  const [concepts, setConcepts] = useState<Concepts>({
    validConcept: "",
    invalidConcept: "",
  });
  const [isCurtainActive, setIsCurtainActive] = useState<boolean>(true);
  const [roundEnded, setRoundEnded] = useState<boolean>(false);

  const [clicksTime, setClicksTime] = useState<{
    loadTime: number;
    firstClick: number;
  }>({ loadTime: 0, firstClick: 0 });

  const drawImages = async () => {
    const response = await fetch(`/api/sketches/fetch-random-sketches`, {
      cache: "no-cache",
      headers: {
        cookie: `user-id=${getUserCookies().userId}`,
      },
    });
    const { allImages, validConcept, invalidConcept } = await response.json();

    setConcepts({ validConcept, invalidConcept });

    setFetchedImages(
      allImages.map((image: RandomImage) => {
        return { ...image, selected: false };
      })
    );

    console.log(fetchedImages);

    setClicksTime({ loadTime: moment().valueOf(), firstClick: 0 });
  };

  const updateBgColorFor1Sec = () => {
    setBgColor(colorResponse(fetchedImages));

    setTimeout(() => {
      setBgColor("bg-white");
    }, 1000);
  };

  const showInvalidAnswers = () => {
    setRoundEnded(true);
    setTimeout(() => {
      setRoundEnded(false);
      prepareNextTrial();
    }, 2000);
  };

  const prepareNextTrial = () => {
    handleCurtain();
    saveAnswer(fetchedImages, concepts);
    saveTrial(clicksTime, fetchedImages, concepts);
    updateBgColorFor1Sec();
    drawImages();
  };

  const handleCurtain = () => {
    setIsCurtainActive(true);
    setTimeout(() => {
      setIsCurtainActive(false);
    }, 3000);
  };

  const updateImageSelection = (index: number) => {
    const updatedImages = fetchedImages.map((image, i) => {
      if (i === index) {
        return { ...image, selected: !image.selected };
      } else {
        return image;
      }
    });

    setFetchedImages(updatedImages);
  };

  const setFirstClickTimeIfNotSet = () => {
    if (clicksTime.firstClick === 0) {
      setClicksTime({ ...clicksTime, firstClick: moment().valueOf() });
    }
  };

  const getPromptText = (index: number): string => {
    if (fetchedImages[index].valid === false && fetchedImages[index].selected) {
      return chance.pickone(correctResponses);
    } else {
      return chance.pickone(incorrectResponses);
    }
  };

  const getRoundFeedback = (): ReactNode => {
    const taggedImagesCount = fetchedImages.filter(
      (image) => image.selected === true
    ).length;

    const invalidImagesCount = fetchedImages.filter(
      (image) => image.valid === false
    ).length;

    if (invalidImagesCount === 0 && taggedImagesCount === 0) {
      return (
        <motion.div
          initial={{ opacity: 0, y: -100, x: "-50%" }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" },
            // Add a second animation to shake the component after it falls down
          }}
          className="absolute top-1/2 left-1/2 bg-green-500 -translate-x-1/2 -translate-y-1/2 z-[120] border-[1px] border-gray-300 p-4 rounded-md"
        >
          Congrats, you have a good eye!
        </motion.div>
      );
    } else if (invalidImagesCount === 0 && taggedImagesCount > 0) {
      return (
        <motion.div
          initial={{ opacity: 0, y: -100, x: "-50%" }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" },
            // Add a second animation to shake the component after it falls down
          }}
          className="absolute top-1/2 left-1/2 bg-red-500 -translate-x-1/2 -translate-y-1/2 z-[120] border-[1px] border-gray-300 p-4 rounded-md"
        >
          It&apos;ll get better with practice!
        </motion.div>
      );
    }
  };

  // Initial load
  useEffect(() => {
    getUserCookies();
    drawImages();
    handleCurtain();
  }, []);

  return (
    <main
      className={`${bgColor} w-full h-screen flex flex-col items-center justify-center gap-10 transition-all relative`}
    >
      {roundEnded && getRoundFeedback()}
      <div className={`curtain ${isCurtainActive ? "active" : ""}`}>
        <p className="font-bold text-2xl">Get ready for the next round...</p>
      </div>
      <div className="flex flex-col gap-5 items-center">
        <p className="[word-spacing:3px] text-center">
          Please tag any image that is{" "}
          <span className="text-red-500"> NOT </span>
          a
          <br />
        </p>
        <div className="flex">
          {concepts.validConcept && (
            <p className="font-bold">{concepts.validConcept}</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-4 gap-5 items-center">
        {fetchedImages.map((image, i) => {
          return (
            <div key={i} className="relative">
              {!image.valid && roundEnded && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={
                    roundEnded ? { opacity: 1, scale: 1.2 } : { opacity: 0 }
                  }
                  transition={{ duration: 0.5, type: "spring", stiffness: 300 }}
                  className={`z-[100] text-xs absolute top-0 right-0 whitespace-nowrap border-[1px] px-2 border-gray-300 rounded-md ${
                    image.selected ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  <h1>{getPromptText(i)}</h1>
                </motion.div>
              )}
              <button
                className={`rounded-md border-[3px]  relative h-[120px] w-[120px] p-[2px] ${
                  image.selected ? "border-blue-500" : "border-gray-400"
                }`}
                onClick={() => {
                  updateImageSelection(i);
                  setFirstClickTimeIfNotSet();
                }}
              >
                <Image
                  src={image.stim_url}
                  fill
                  alt="Doodle"
                  className="rounded-md"
                />
              </button>
            </div>
          );
        })}
      </div>
      <DoodleButton disabled={roundEnded} onClick={showInvalidAnswers}>
        Next
      </DoodleButton>
    </main>
  );
};

export default Game;

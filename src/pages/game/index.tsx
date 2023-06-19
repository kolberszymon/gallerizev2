import type { NextPage } from "next";
import DoodleButton from "@/components/DoodleButton";
import Image from "next/image";
import { ReactNode, useEffect, useState } from "react";
import getUserCookies, { clearUserCookies } from "@/utils/getUserCookie";
import { RandomImage } from "@/types/Image";
import { saveAnswer } from "@/utils/trials/saveAnswer";
import { saveTrial } from "@/utils/trials/saveTrial";
import moment from "moment";
import { Concepts } from "@/types/Concepts";
import { motion } from "framer-motion";
import Chance from "chance";
import {
  incorrectResponses,
  correctResponses,
} from "@/utils/feedbackResponses";
import { useWindowSize } from "usehooks-ts";
import Confetti from "react-confetti";
import areArraysEqual from "@/utils/areArraysEqual";
import { useRouter } from "next/router";

const chance = new Chance();
const roundsInGame = 2;

const Game: NextPage = () => {
  const [fetchedImages, setFetchedImages] = useState<RandomImage[]>([]);
  const [concepts, setConcepts] = useState<Concepts>({
    validConcept: "",
    invalidConcept: "",
  });
  const [isCurtainActive, setIsCurtainActive] = useState<boolean>(true);
  const [roundEnded, setRoundEnded] = useState<boolean>(false);
  const { width, height } = useWindowSize();
  const [clicksTime, setClicksTime] = useState<{
    loadTime: number;
    firstClick: number;
  }>({ loadTime: 0, firstClick: 0 });
  const [currentRound, setCurrentRound] = useState<number>(1);
  const router = useRouter();

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

  const showInvalidAnswers = () => {
    setCurrentRound((round) => round + 1);

    console.log("currentRound");
    console.log(currentRound);

    setRoundEnded(true);
    setTimeout(() => {
      if (currentRound < roundsInGame) {
        prepareNextTrial();
      } else {
        clearUserCookies();
      }
      setRoundEnded(false);
      setIsCurtainActive(true);
    }, 2000);
  };

  const prepareNextTrial = () => {
    handleCurtain();
    saveAnswer(fetchedImages, concepts);
    saveTrial(clicksTime, fetchedImages, concepts);
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
    const taggedImages = fetchedImages.filter(
      (image) => image.selected === true
    );

    const invalidImages = fetchedImages.filter(
      (image) => image.valid === false
    );

    if (invalidImages.length === 0 && taggedImages.length === 0) {
      return (
        <>
          <Confetti width={width} height={height} gravity={1} />
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
            Congrats, you have a good eye! Keep it up!
          </motion.div>
        </>
      );
    } else if (invalidImages.length === 0 && taggedImages.length > 0) {
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
    } else if (areArraysEqual(invalidImages, taggedImages)) {
      return <Confetti width={width} height={height} gravity={1} />;
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
      className={`bg-white w-full h-screen flex flex-col items-center justify-center gap-10 transition-all relative`}
    >
      {roundEnded && getRoundFeedback()}
      <div
        className={`curtain flex flex-col ${isCurtainActive ? "active" : ""}`}
      >
        {currentRound <= roundsInGame ? (
          <>
            <p className="font-bold text-2xl comic-font-white">
              GET READY FOR THE NEXT ROUND
            </p>
            <p className="comic-font-white mt-10 text-2xl">
              {currentRound} / {roundsInGame}
            </p>
          </>
        ) : (
          <>
            <p className="font-bold text-2xl uppercase comic-font-white">
              Thanks for playing!
            </p>
            <button
              className={`pushable mt-10 cyberpunk-font ${
                isCurtainActive ? "block" : "hidden"
              }`}
            >
              <span
                className="front border-2 border-black"
                onClick={() => router.reload()}
              >
                Play again
              </span>
            </button>
          </>
        )}
      </div>
      <div className="flex flex-col gap-5 items-center">
        <p className="[word-spacing:3px] text-center">
          Spot the sketches that don&apos;t belong!
        </p>
        <div className="flex">
          {concepts.validConcept && (
            <p className="font-bold text-3xl uppercase">
              {concepts.validConcept.replace(/_/g, " ")}
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-4 gap-5 items-center">
        {fetchedImages.map((image, i) => {
          if (roundEnded) {
            return (
              <div key={i} className="relative">
                {!image.valid && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={
                      roundEnded ? { opacity: 1, scale: 1.2 } : { opacity: 0 }
                    }
                    transition={{
                      duration: 0.5,
                      type: "spring",
                      stiffness: 300,
                    }}
                    className={`z-[100] text-xs absolute top-0 right-0 whitespace-nowrap border-[1px] px-2 border-gray-300 rounded-md ${
                      image.selected ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    <h1>{getPromptText(i)}</h1>
                  </motion.div>
                )}
                <motion.button
                  className={`rounded-md relative h-[120px] w-[120px] p-[2px] ${
                    image.selected &&
                    image.valid &&
                    "border-gray-400 border-[3px]"
                  } ${
                    !image.selected &&
                    !image.valid &&
                    "border-red-500 border-[5px]"
                  } ${
                    image.selected &&
                    !image.valid &&
                    "border-green-500 border-[5px]"
                  } ${!image.selected && "border-gray-400 border-[3px]"}`}
                  disabled={roundEnded}
                >
                  <Image
                    src={image.stim_url}
                    fill
                    alt="Doodle"
                    className="rounded-md"
                  />
                </motion.button>
              </div>
            );
          }

          return (
            <motion.button
              key={i}
              className={`rounded-md relative h-[120px] w-[120px] p-[2px] ${
                image.selected
                  ? "border-blue-500 border-[5px]"
                  : "border-gray-400 border-[3px]"
              } `}
              onClick={() => {
                updateImageSelection(i);
                setFirstClickTimeIfNotSet();
              }}
              whileHover={{
                scale: 1.1,
              }}
              disabled={roundEnded}
            >
              <Image
                src={image.stim_url}
                fill
                alt="Doodle"
                className="rounded-md"
              />
            </motion.button>
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

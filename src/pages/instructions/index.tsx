import type { NextPage } from "next";
import DoodleButton from "@/components/DoodleButton";
import Image from "next/image";
import { ReactNode, useEffect, useState } from "react";
import getUserCookies, { clearUserCookies } from "@/utils/common/getUserCookie";
import { RandomImage } from "@/types/Image";
import moment from "moment";
import { Concepts } from "@/types/Concepts";
import { motion } from "framer-motion";
import { useWindowSize } from "usehooks-ts";
import Confetti from "react-confetti";
import areArraysEqual from "@/utils/common/areArraysEqual";
import { useRouter } from "next/router";

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
  const [currentInstructionIndex, setCurrentInstructionIndex] =
    useState<number>(0);
  const router = useRouter();

  const drawImages = async () => {
    const response = await fetch(
      `/api/sketches/fetch-random-sketches-for-instruction`,
      {
        cache: "no-cache",
        headers: {
          cookie: `user-id=${getUserCookies().userId}`,
        },
      }
    );
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
      <div className={`curtain ${isCurtainActive ? "active" : ""}`}>
        <p className="font-bold text-2xl comic-font-white uppercase">
          Fetching images...
        </p>
      </div>
      <div className="flex flex-col gap-5 items-center">
        <p className="[word-spacing:3px] text-center">
          Spot the sketches that don&apos;t belong!
        </p>
        <div className="flex">
          {concepts.validConcept && (
            <p
              className={`font-bold text-3xl uppercase ${
                currentInstructionIndex === 0 && "border-red-500 border-4 p-1 "
              }`}
            >
              {concepts.validConcept.replace(/_/g, " ")}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center justify-around px-10">
        <div className="grid grid-cols-4 gap-5 items-center">
          {fetchedImages.map((image, i) => {
            if (roundEnded) {
              return <div key={i} className="relative"></div>;
            }

            return (
              <motion.button
                key={i}
                className={`rounded-md relative h-[120px] w-[120px] p-[2px] ${
                  currentInstructionIndex === 1 && !image.valid
                    ? "border-red-500 border-[3px]"
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
                {!image.valid && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={
                      currentInstructionIndex === 1
                        ? { opacity: 1, scale: 1.2 }
                        : { opacity: 0 }
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
                    <h1>Don&apos;t belong</h1>
                  </motion.div>
                )}
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

        {currentInstructionIndex === 0 && (
          <p className="w-1/4 text-center text-2xl">
            {`Most of these sketches were made by people trying to make a quick
            sketch that looks like a ${concepts.validConcept.toUpperCase()}`}
          </p>
        )}

        {currentInstructionIndex === 1 && (
          <p className="w-1/4 text-center text-2xl">
            Some of these sketches might look better than other ones, and
            that&apos;s okay! Your job is to spot the sketches that don&apos;t
            belong — meaning the ones that were meant to look like something
            else.
          </p>
        )}

        {currentInstructionIndex === 2 && (
          <p className="w-1/4 text-center text-2xl">
            So this game is not really about deciding which sketches &quot;look
            good.&quot; It&apos;s really about figuring out what idea people
            were trying to communicate with their sketch.
          </p>
        )}
      </div>

      {currentInstructionIndex === 3 && (
        <p className=" text-center text-2xl">Ready?</p>
      )}
      <DoodleButton
        disabled={roundEnded}
        onClick={() => {
          if (currentInstructionIndex === 3) {
            clearUserCookies();
            router.push("/game");
            return;
          }
          setCurrentInstructionIndex((prev) => prev + 1);
        }}
      >
        {currentInstructionIndex === 3 ? "Let's go!" : "Next"}
      </DoodleButton>
    </main>
  );
};

export default Game;

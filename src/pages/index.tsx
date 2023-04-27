import { Navbar } from "@/components/Navbar";
import type { NextPage } from "next";
import DoodleButton from "@/components/DoodleButton";
import Image from "next/image";
import { useEffect, useState } from "react";
import getUserCookies from "@/utils/getUserCookie";
import { Image as ImageType, RandomImage } from "@/types/Image";
import { saveAnswer } from "@/utils/trials/saveAnwer";
import {
  unmarkImage,
  markImage,
  resetMarkedImages,
} from "@/utils/markingImages";
import { saveTrial } from "@/utils/trials/saveTrial";
import moment from "moment";
import { colorResponse } from "@/utils/colorResponse";

const Home: NextPage = () => {
  const [randomImages, setRandomImages] = useState<RandomImage[]>([]);
  const [invalidIds, setInvalidIds] = useState<number[]>([]);
  const [markedImages, setMarkedImages] = useState<number[]>([]);
  const [bgColor, setBgColor] = useState<
    "bg-white" | "bg-red-200" | "bg-green-200" | "bg-yellow-200"
  >("bg-white");
  const [validConcepts, setValidConcepts] = useState<string[]>([]);
  const [clicksTime, setClicksTime] = useState<{
    loadTime: number;
    firstClick: number;
  }>({ loadTime: 0, firstClick: 0 });

  const drawImages = async () => {
    const images = await fetch(`/api/sketches/fetch-random-sketches`, {
      cache: "no-cache",
      headers: {
        cookie: `user-id=${getUserCookies().userId}`,
      },
    });
    const { images: json, validConcepts } = await images.json();

    setValidConcepts(validConcepts);

    setRandomImages(json);
    setInvalidIds(
      json
        .map((image: ImageType, i: number) => {
          if (!image.valid) return i;
        })
        .filter((i: any) => i)
    );
    setClicksTime({ loadTime: moment().valueOf(), firstClick: 0 });
  };

  const updateBgColorFor1Sec = () => {
    setBgColor(colorResponse(invalidIds, markedImages));

    setTimeout(() => {
      setBgColor("bg-white");
    }, 1000);
  };

  const prepareNextTrial = () => {
    saveAnswer(randomImages, markedImages, invalidIds);
    saveTrial(clicksTime, randomImages, markedImages);
    updateBgColorFor1Sec();
    resetMarkedImages(setMarkedImages);
    drawImages();
  };

  // Initial load
  useEffect(() => {
    getUserCookies();
    drawImages();
  }, []);

  useEffect(() => {
    if (clicksTime.firstClick === 0) {
      setClicksTime({ ...clicksTime, firstClick: moment().valueOf() });
    }
  }, [markedImages]);

  return (
    <>
      <Navbar />
      <main
        className={`${bgColor} w-full h-screen flex flex-col items-center justify-center gap-10 transition-all`}
      >
        <div className="flex flex-col gap-5 items-center">
          <p className="[word-spacing:3px] text-center">
            Please tag all images that{" "}
            <span className="text-red-500">DOES NOT </span>
            contain
            <br />
          </p>
          <div className="flex">
            {validConcepts.map((concept, i) => {
              return (
                <p className="font-bold" key={concept}>
                  {concept}
                </p>
              );
            })}
          </div>
        </div>
        <div className="grid grid-cols-4 gap-5 items-center">
          {randomImages.map((image, i) => {
            if (markedImages.includes(i)) {
              return (
                <button
                  className="bg-red-200 rounded-md border-2 border-red-500 doodle-shadow relative h-[70px] w-[70px] doodle-button"
                  key={i}
                  onClick={() => {
                    unmarkImage(setMarkedImages, i);
                  }}
                >
                  <Image
                    src={image.stim_url}
                    fill
                    alt="Doodle"
                    className="rounded-md"
                  />
                </button>
              );
            }
            return (
              <button
                className="bg-white border border-black rounded-md doodle-shadow relative h-[70px] w-[70px] doodle-button"
                key={i}
                onClick={() => {
                  markImage(setMarkedImages, i);
                }}
              >
                <Image
                  src={image.stim_url}
                  fill
                  alt="Doodle"
                  sizes=""
                  className="rounded-md"
                />
              </button>
            );
          })}
        </div>
        <DoodleButton onClick={prepareNextTrial}>Next</DoodleButton>
      </main>
    </>
  );
};

export default Home;

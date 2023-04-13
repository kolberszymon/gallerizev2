import { Navbar } from "@/components/Navbar";
import type { NextPage } from "next";
import DoodleButton from "@/components/DoodleButton";
import Image from "next/image";
import { useEffect, useState } from "react";

const Home: NextPage = () => {
  const [randomImages, setRandomImages] = useState<
    { valid: boolean; id: string; stim_url: string; concept: string }[]
  >([]);
  const [invalidIds, setInvalidIds] = useState<number[]>([]);
  const [markedImages, setMarkedImages] = useState<number[]>([]);
  const [bgColor, setBgColor] = useState<
    "bg-white" | "bg-red-200" | "bg-green-200"
  >("bg-white");

  const drawImages = async () => {
    const images = await fetch(`/api/sketches/fetch-random-sketches`, {
      cache: "no-cache",
    });
    const json = await images.json();
    console.log(json);
    setRandomImages(json);
    setInvalidIds(
      json
        .map(
          (
            image: {
              valid: boolean;
              id: string;
              stim_url: string;
              concept: string;
            },
            i: number
          ) => {
            if (!image.valid) return i;
          }
        )
        .filter((i: number) => i !== undefined)
    );
  };

  const unmarkImage = (index: number) => {
    setMarkedImages((prev) => prev.filter((i) => i !== index));
  };

  const markImage = (index: number) => {
    setMarkedImages((prev) => [...prev, index]);
  };

  const resetMarkedImages = () => {
    setMarkedImages([]);
  };

  const checkIfCorrect = () => {
    if (invalidIds.sort().join(",") === markedImages.sort().join(",")) {
      return true;
    }
    return false;
  };

  const updateBgColorFor1Sec = () => {
    if (checkIfCorrect()) {
      setBgColor("bg-green-200");
    } else {
      setBgColor("bg-red-200");
    }

    setTimeout(() => {
      setBgColor("bg-white");
    }, 1000);
  };

  useEffect(() => {
    drawImages();
  }, []);

  return (
    <>
      <Navbar />
      <main
        className={`${bgColor} w-full h-screen flex flex-col items-center justify-center gap-10 transition-all`}
      >
        <div className="grid grid-cols-4 gap-5 items-center">
          {randomImages.map((image, i) => {
            console.log(markedImages.includes(i));

            if (markedImages.includes(i)) {
              return (
                <button
                  className="bg-red-200 rounded-md border-2 border-red-500 doodle-shadow relative h-[70px] w-[70px] doodle-button"
                  key={i}
                  onClick={() => {
                    unmarkImage(i);
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
                  markImage(i);
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
        <DoodleButton
          onClick={() => {
            updateBgColorFor1Sec();
            resetMarkedImages();
            drawImages();
          }}
        >
          Next
        </DoodleButton>
        {/* <div className="text-center flex flex-col">
        <p>Please categorise if the image is valid or invalid</p>
        <p>
          In order to do so, you can either press the buttons by mouse or
          keyboard
        </p>
      </div> */}
      </main>
    </>
  );
};

export default Home;

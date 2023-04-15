import { Navbar } from "@/components/Navbar";
import type { NextPage } from "next";
import DoodleButton from "@/components/DoodleButton";
import Image from "next/image";
import { useEffect, useState } from "react";
import getUserCookies from "@/utils/getUserCookie";
//@ts-ignore
import cookieCutter from "cookie-cutter";
import { Image as ImageType } from "@/types/Image.dto";

const Home: NextPage = () => {
  const [randomImages, setRandomImages] = useState<
    { valid: boolean; id: string; stim_url: string; concept: string }[]
  >([]);
  const [invalidIds, setInvalidIds] = useState<number[]>([]);
  const [markedImages, setMarkedImages] = useState<number[]>([]);
  const [bgColor, setBgColor] = useState<
    "bg-white" | "bg-red-200" | "bg-green-200" | "bg-yellow-200"
  >("bg-white");
  const [validConcepts, setValidConcepts] = useState<string[]>([]);

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
        .map((image: ImageType & { valid: boolean }, i: number) => {
          if (!image.valid) return i;
        })
        .filter((i: any) => i !== undefined && i !== null)
    );
  };

  const saveAnswer = async () => {
    const taggedImages = randomImages
      .map((image, i) => {
        if (markedImages.includes(i)) {
          return image;
        }
      })
      .filter((i) => i !== undefined);

    const response = await fetch(`/api/sketches/save-answer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: `user-id=${
          getUserCookies().userId
        }, gallerize-user-id-weight=${cookieCutter.get(
          "gallerize-user-id-weight"
        )}'`,
      },
      body: JSON.stringify({
        taggedImages,
        invalidIdsCount: invalidIds.length,
      }),
    });

    const { penalty, reward } = await response.json();

    const currentWeight = cookieCutter.get("gallerize-user-id-weight");

    if (reward) {
      if (currentWeight < 1 - reward) {
        cookieCutter.set(
          "gallerize-user-id-weight",
          Number(currentWeight) + Number(reward)
        );
      } else {
        cookieCutter.set("gallerize-user-id-weight", 1);
      }
    } else {
      cookieCutter.set("gallerize-user-id-weight", currentWeight * penalty);
    }
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

  const colorResponse = () => {
    if (invalidIds.sort().join(",") === markedImages.sort().join(",")) {
      return "bg-green-200";
    }

    console.log(markedImages.length > invalidIds.length);

    if (
      markedImages.sort().join(",").includes(invalidIds.sort().join(",")) &&
      markedImages.length > invalidIds.length
    ) {
      return "bg-yellow-200";
    }

    return "bg-red-200";
  };

  const updateBgColorFor1Sec = () => {
    setBgColor(colorResponse());

    setTimeout(() => {
      setBgColor("bg-white");
    }, 1000);
  };

  useEffect(() => {
    getUserCookies();
    drawImages();
  }, []);

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
            saveAnswer();
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

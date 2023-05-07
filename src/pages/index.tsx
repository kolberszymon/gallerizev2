import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

// Pages
const instructions = [
  {
    title: "Welcome to the gallerize!",
    content:
      "Gallerize is a project aimed at understanding how people perceive and interpret images. In this game, you will be presented with a series of images and asked to determine whether they represent a given concept (e.g., ball) in a valid or invalid way.",
  },
  {
    title: "Purpose",
    content:
      "Carefully examine each image and determine whether it represents the given concept (e.g., ball) in a valid or invalid way. If you think an image is invalid, click or tap on it to select it. If you think an image is valid, do not select it.",
  },
  {
    title: "How to play",
    content:
      "Once you have selected two images that you believe are invalid, submit your choices. The game will then tell you whether your selections were correct or not. If you selected both invalid images, you win the game. If you selected one or no invalid images, you lose the game and can try again.",
  },
];

const Home: NextPage = () => {
  const [currentInstruction, setCurrentInstruction] = useState<number>(0);
  const router = useRouter();

  const buttonAction = () => {
    if (currentInstruction === instructions.length - 1) {
      router.push("/game");
    } else {
      setCurrentInstruction((prev) => prev + 1);
    }
  };

  return (
    <main
      className={`w-full h-screen flex flex-col items-center justify-center gap-10 transition-all relative bg-yellow-400`}
    >
      <motion.div
        key={currentInstruction}
        className="w-1/2 h-1/2 flex flex-col items-center justify-center gap-10 "
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-4xl font-bold">
          {instructions[currentInstruction].title}
        </h2>
        <p className="text-center">
          {instructions[currentInstruction].content}
        </p>
      </motion.div>

      <button className="pushable bg-green-500">
        <span className="front" onClick={buttonAction}>
          {currentInstruction === instructions.length - 1
            ? "Start the game"
            : "Next"}
        </span>
      </button>
    </main>
  );
};

export default Home;

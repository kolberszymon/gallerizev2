import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import Image from "next/image";

// Pages
const instructions = [
  {
    title: "Welcome to the gallerize!",
    type: "paragraphs",
    content: [
      "In this game, you will be shown several grids of drawings and asked to find the drawings that don’t match the word at the top of the screen.",
      "If you think a drawing does not match the word, select the drawing by clicking on it with your mouse or tapping on it with your finger.",
    ],
  },
  {
    title: "How to play",
    type: "images",
    content: ["/images/instruction1.webp", "/images/instruction2.webp"],
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
      className={`w-full h-screen flex flex-col items-center justify-center gap-10 transition-all relative bg-blue-400`}
    >
      <motion.div
        key={currentInstruction}
        className="w-1/2 h-1/2 flex flex-col items-center justify-center gap-10 "
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-4xl font-bold comic-font-white uppercase leading-loose text-center">
          {instructions[currentInstruction].title}
        </h2>
        <div className="w-[60%] flex flex-col gap-5">
          {instructions[currentInstruction].content.map((paragraph, i) => {
            if (instructions[currentInstruction].type === "paragraphs") {
              return (
                <p key={i} className="text-center text-xl">
                  {paragraph}
                </p>
              );
            } else if (instructions[currentInstruction].type === "images") {
              console.log(paragraph);
              return (
                <Image
                  key={i}
                  src={paragraph}
                  alt={"Instruction" + i}
                  width={876}
                  height={600}
                />
              );
            }
          })}
        </div>
      </motion.div>

      <button className="pushable bg-yellow-500 mt-10">
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

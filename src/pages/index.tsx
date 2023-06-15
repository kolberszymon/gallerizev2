import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const router = useRouter();

  return (
    <main
      className={`w-full h-screen flex flex-col items-center justify-center gap-10 transition-all relative bg-blue-400`}
    >
      <motion.div
        className="w-1/2 h-1/2 flex flex-col items-center justify-center gap-10 "
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-4xl font-bold comic-font-white uppercase leading-loose text-center">
          Welcome!
        </h2>
        <div className="w-[60%] flex flex-col gap-5 items-center justify-center">
          <p className="text-center text-2xl">
            In this game, you will be shown a bunch of sketches made by other
            people. Your job is to spot the ones that you think don&apos;t
            belong!
          </p>
        </div>
      </motion.div>

      <button className="pushable mt-10 cyberpunk-font ">
        <span
          className="front border-2 border-black"
          onClick={() => router.push("instructions")}
        >
          How to play?
        </span>
      </button>
    </main>
  );
};

export default Home;

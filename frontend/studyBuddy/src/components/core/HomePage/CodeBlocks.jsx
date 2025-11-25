import React from "react";
import CTAButton from "./Button";
import { FaArrowRight } from "react-icons/fa";
import { TypeAnimation } from "react-type-animation";

const CodeBlocks = ({
  position,
  heading,
  subheading,
  ctabtn1,
  ctabtn2,
  codeblock,
  backgroundGradient,
  codeColor,
}) => {
  return (
    <div
      className={`flex ${position} my-20 justify-between flex-col lg:flex-row gap-10  `}
    >
      {/* Section 1: Text Content */}
      <div className=" flex  max-w-4xl flex-1  flex-col gap-8">
        {heading}

        <div className="text-richblack-300 text-base font-bold w-[85%] -mt-3">
          {subheading}
        </div>

        <div className="flex gap-7 mt-7">
          <CTAButton active={ctabtn1.active} linkto={ctabtn1.link}>
            <div className="flex gap-2 items-center">
              {ctabtn1.btnText}
              <FaArrowRight />
            </div>
          </CTAButton>

          <CTAButton active={ctabtn2.active} linkto={ctabtn2.link}>
            {ctabtn2.btnText}
          </CTAButton>
        </div>
      </div>

      {/* Section 2: Code Block */}
      {/* FIX: Added strict 'lg:w-[500px]' to stop width jittering */}
      <div className="h-fit max-w-4xl code-border flex flex-row py-3 text-[10px] sm:text-sm leading-[18px] bg-richblack-900/25   sm:leading-6 relative flex-1 border border-richblack-700 rounded-md backdrop-blur-sm p-2">
        {/* Gradient Layer - Absolute Positioned */}
        {backgroundGradient}

        {/* Indexing (Line Numbers) */}
        {/* FIX: Fixed width of 10% ensures numbers don't jump */}
        <div className="text-center flex flex-col w-[10%] select-none text-richblack-400 font-inter font-bold ">
          <p>1</p>
          <p>2</p>
          <p>3</p>
          <p>4</p>
          <p>5</p>
          <p>6</p>
          <p>7</p>
          <p>8</p>
          <p>9</p>
          <p>10</p>
          <p>11</p>
        </div>

        {/* Code Animation */}
        {/* FIX: w-[90%] ensures it takes remaining space but doesn't expand the parent */}
        <div
          className={`w-[90%] flex flex-col gap-2 font-bold font-mono ${codeColor} pr-1`}
        >
          <TypeAnimation
            sequence={[codeblock, 1000, ""]}
            repeat={Infinity}
            cursor={true}
            style={{
              whiteSpace: "pre-line",
              display: "block",
            }}
            omitDeletionAnimation={true}
          />
        </div>
      </div>
    </div>
  );
};

export default CodeBlocks;

import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import HighlightText from "../components/core/HomePage/HighlightText.jsx";
import CTAButton from "../components/core/HomePage/Button.jsx";
import Banner from "../assets/Images/banner.mp4";
import CodeBlocks from "../components/core/HomePage/CodeBlocks.jsx";

function Home() {
  return (
    <div className="relative text-white mx-auto flex flex-col items-center justify-center w-full min-h-[80vh]">
      <Link to={"/signup"}>
        {/* button */}
        <div className="group mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200 shadow-inset_0px_-1px_0px_rgba(255,255,255,0.18)] px-1 py-1 flex gap-2 duration-200 cursor-pointer   hover:bg-richblack-900 hover:-translate-y-[1.5px]">
          <div className="flex gap-2 items-center px-6 sm:px-10 py-[7px] rounded-full">
            <p>Become an Instructor</p>
            <FaArrowRight />
          </div>
        </div>
      </Link>

      <div className="text-center text-4xl font-semibold mt-10">
        Empower Your Future with
        <HighlightText text={"Coding Skills!"} />
      </div>

      <div className="text-center text-richblack-300 mt-4 w-full md:w-3/4 lg:w-1/2">
        Join our community of passionate learners and experienced instructors.
        Explore a wide range of coding courses, from beginner to advanced
        levels, and take your skills to the next level.
      </div>

      <div className="flex flex-row gap-7 mt-8">
        {/* button */}
        <CTAButton active={true} linkto={"/signup"}>
          Learn More
        </CTAButton>
        <CTAButton active={false} linkto={"/signup"}>
          Book Demo
        </CTAButton>
      </div>

      <div className="w-full flex justify-center">
        <video
          muted
          loop
          autoPlay
          className="mt-10 w-full max-w-[720px] rounded-lg border-2 border-richblack-700 shadow-lg shadow-blue-200"
        >
          <source src={Banner} type="video/mp4" />
        </video>
      </div>
      {/* code section 1 */}
      <div>
        <CodeBlocks
          position={"left"}
          heading={
            <div className="text-4xl font-semibold">
              Unlock Your
              <HighlightText text={"coding potential"} />
              with our online courses
            </div>
          }
          subheading={
            "Join thousands of learners and instructors on StudyBuddy and take your coding skills to the next level."
          }
          ctabtn1={{
            btnText: "Try it yourself",
            linkto: "/signup",
            active: true,
          }}
          ctabtn2={{ btnText: "learn more", linkto: "/signup", active: false }}
          codeblock={`// function to add two numbers
                    function add(a, b) {
                        return a + b;
                    }`}
          bakcgroundGradient={"bg-gradient-to-r from-[#2d2d2d] to-[#1a1a1a]"}
          codeColor={"text-Yellow-25"}
        />
      </div>

      <div>
        <CodeBlocks
          position={"right"}
          heading={
            <div className="text-4xl font-semibold">
              Unlock Your
              <HighlightText text={"coding potential"} />
              with our online courses
            </div>
          }
          subheading={
            "Join thousands of learners and instructors on StudyBuddy and take your coding skills to the next level."
          }
          ctabtn1={{
            btnText: "Try it yourself",
            linkto: "/signup",
            active: true,
          }}
          ctabtn2={{ btnText: "learn more", linkto: "/signup", active: false }}
          codeblock={`// function to add two numbers
                    function add(a, b) {
                        return a + b;
                    }`}
          bakcgroundGradient={"bg-gradient-to-r from-[#46481] to-[#1a1a1a]"}
          codeColor={"text-Yellow-25"}
        />
      </div>

      {/* section 2 */}
      <div className="bg-pure-greys-5 text-richblack-700 w-full mt-10">
            <div className="h-[300px]" style={{
                backgroundImage: `url('../src/assets/Images/bghome.svg')`,
                backgroundPosition: "center", 
                }}
                >
                <div className="w-11/12 max-w-maxContent flex items-center justify-center gap-5 mx-auto">
                    <div className="flex flex-row gap-7 text-white mt-40">
                        <CTAButton active={true} linkto={"/signup"}>
                            <div className="flex gap-2 items-center">
                                Explore Full courses
                            <FaArrowRight />
                            </div>
                        </CTAButton>
                        <CTAButton active={false} linkto={"/signup"}>
                            Learn More

                        </CTAButton>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}

export default Home;

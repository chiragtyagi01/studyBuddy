import React from 'react'
import CTAButton from './Button.jsx'
import HighlightText from './HighlightText.jsx'
import {FaArrowRight} from 'react-icons/fa'
import {TypeAnimation} from 'react-type-animation'


function CodeBlocks({position, heading, subheading, ctabtn1, ctabtn2, codeblock, bakcgroundGradient, codeColor}) {
    return (
        <div className={`flex ${position === 'left' ? 'flex-row' : 'flex-row-reverse'} w-11/12 mx-auto mt-20 items-center justify-between gap-10`}>
            {/* text section */}
            <div className='w-1/2 text-4xl flex flex-col gap-8'>
                {heading}                
                <div className='text-xl font-semibold'>
                    {subheading}
                </div>
                
                {/* buttons */}
                <div className='flex flex-row gap-7 mt-8'>
                    <CTAButton active={ctabtn1.active} linkto={ctabtn1.linkto}>
                        <div className='flex gap-2 items-center'>
                            {ctabtn1.btnText}
                            <FaArrowRight />
                        </div>
                    </CTAButton>
                    
                    <CTAButton active={ctabtn2.active} linkto={ctabtn2.linkto}>
                        {ctabtn2.btnText}
                    </CTAButton>
                </div>
            </div>

            {/* code block section */}
            <div className={`w-1/2 p-4 rounded-lg ${bakcgroundGradient} flex`}>
                
                {/* Line Numbers column */}
                <div className='flex flex-col text-richblack-400 font-inter font-bold pr-2'>
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
                
                {/* Code Content column */}
                <code className={`text-sm font-mono overflow-x-auto ${codeColor} flex-1`}>
                    <TypeAnimation
                        sequence={[
                            codeblock,
                            1000,
                        ]}
                        speed={50}
                        repeat={Infinity}
                        cursor={true}
                        omitDeletionAnimation={true}
                        style={{ whiteSpace: 'pre-line', display: 'block' }}
                    />
                </code>
            </div>
        </div>
    )
}

export default CodeBlocks
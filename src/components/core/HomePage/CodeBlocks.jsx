import React from 'react'
import CTAButton from '../HomePage/Button';
import HighlightText from './HighlightText';
import { FaArrowRight } from 'react-icons/fa';
import { TypeAnimation } from 'react-type-animation';

export const CodeBlocks = ({
    position,heading,subheading,ctabtn1,ctabtn2,codeblock,backgroundGradient,codeColor
}) => {
  return (
        <div className={`flex ${position} my-20 justify-between gap-10 flex-col`}> 

            {/* Section 1 */}
            <div className='w-[100%] lg:w-[50%] flex flex-col gap-8'>
                <div>{heading}</div>
                <div className='text-richblack-300 font-bold text-base w-[85%] -mt-3'>{subheading}</div>
            
                <div className='flex flex-row gap-7 mt-7'>
                    <CTAButton active={ctabtn1.active} linkto={ctabtn1.linkto}>
                        <div className='flex gap-2 items-center'>
                            {ctabtn1.btnText}
                            <FaArrowRight/>
                        </div>
                    </CTAButton>
                    <CTAButton active={ctabtn2.active} linkto={ctabtn2.linkto}>
                        {ctabtn2.btnText}
                    </CTAButton>
                </div>
            </div>
 
            {/*Section - 2 */}
            <div className='h-fit code-border flex flex-row  text-[10px] py-4 sm:text-sm leading-[18px] sm:leading-6 relative w-[100%] lg:w-[470px]'>
            {backgroundGradient}
                 <div className='text-center flex flex-col w[10%] text-richblack-400 font-inter font-bold'>
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
                 <div className={`w-[90%] flex flex-col gap-2 font-bold font-mono ${codeColor} pr-2`}>
                        <TypeAnimation
                            sequence={[codeblock,100,""]}
                            repeat={Infinity}
                            cursor={true}

                            style={
                                {
                                    whiteSpace:"pre-line",
                                    display:"block",
                                }
                            }
                            // omitDeletionAnimation={true}
                        />
                 </div>
            </div>
        </div>
  )
}

export default CodeBlocks; 
import React from 'react'
import HighlightText from './HighlightText';
import know_your_progress from "../../../assets/Images/Know_your_progress.png"
import compare_with_others from "../../../assets/Images/Compare_with_others.png"
import plan_your_lesson from "../../../assets/Images/Plan_your_lessons.png";
import CTAButton from './Button';
const LearningLanguageSection = () => {
  return (
    <div className='flex flex-col gap-5 mt-[150px] items-center mb-32'>
        <div className='text-4xl font-semibold text-center'>
            Your Swiss Knife for
            <HighlightText text={"learning any language"}/>
        </div>

        <div className='text-center text-richblack-700 font-medium lg:w-[75%] mx-auto leading-6 text-base mt-3'>
            Using spin making learning multiple languages easy. 
            With 20+ languages realistic voice-ov er, progress tracking, 
            custom schedule and more.

        </div>
        {/* images */}
        <div className='flex flex-col lg:flex-row items-center justify-center mt-8 lg:mt-0 '>
            <img 
                src={know_your_progress} 
                alt="know_your_progress image" 
                className='object-contain lg:-mr-32'
            />
            <img 
                src={compare_with_others} 
                alt="compare_with_others image" 
                className='object-contain lg:-mb-10 lg:-mt-0 -mt-12'
            />
            <img 
                src={plan_your_lesson} 
                alt="plan_your_lesson image" 
                className='object-contain  lg:-ml-36 lg:-mt-5 -mt-16'
            />
        </div>
        
        <div className='w-fit'>
            <CTAButton active={true} linkto={"./signup"}>
                <div>
                    Learn More
                </div>
            </CTAButton>
        </div>
        
    </div>
  )
}

export default LearningLanguageSection;
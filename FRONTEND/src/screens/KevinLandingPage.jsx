import React from 'react'
import { Particles } from "@/components/ui/particles";
import { useNavigate } from 'react-router-dom';


const KevinLandingPage = () => {

    const navigate = useNavigate()



  return (
    <main className='relative min-h-screen overflow-hidden bg-[#02040F]'>
        {/* Background Particles */}
            <Particles
                className="absolute inset-0 z-0"
                quantity={180}
                ease={90}
                staticity={40}
                size={2}
                color="#ffffff"
            />
        <div className="relative z-10 flex min-h-screen flex-col-reverse lg:flex-row pt-6 lg:pt-0">

                {/* Text Section */}
                <div className="flex w-full lg:w-1/2 items-center justify-center px-6 py-10 lg:px-14">
                    <div className="max-w-xl text-center lg:text-left">
                        <h1 className="mb-6 text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
                            <span className="text-white">KEVIN.AI</span> - AI Powered Chat
                            System.
                        </h1>

                        <p className="mb-8 text-sm leading-7 text-gray-300 sm:text-base">
                            Chat smarter with Kevin.AI. Get instant answers, writing help,
                            coding support, translations, and AI-powered assistance anytime,
                            anywhere.
                        </p>
 
                        <button onClick={()=>{
                            navigate('/Login')
                        }} className="group relative inline-flex items-center justify-center overflow-hidden rounded-full cursor-pointer border border-white/20 bg-gray-800/30 px-6 py-3 text-white backdrop-blur-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-white/10">
                            <span>Get Started</span>

                            <div className="absolute inset-0 flex justify-center [transform:skew(-13deg)_translateX(-120%)] group-hover:duration-1000 group-hover:[transform:skew(-13deg)_translateX(120%)]">
                                <div className="h-full w-10 bg-white/20"></div>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Image Section */}
                <div className="relative flex w-full lg:w-1/2 items-start lg:items-center justify-center pt-10 md:pt-0">

                    {/* Glow */}
                    <div className="absolute h-[280px] w-[280px] rounded-full bg-white/10 blur-[120px] sm:h-[350px] sm:w-[350px] lg:h-[450px] lg:w-[450px]" />

                    <div className="relative">
                        <img
                            src="../../public/KevinModal.png"
                            alt="Kevin AI"
                            className="relative z-10 w-[280px] sm:w-[360px] md:w-[420px] lg:w-[560px] object-contain [mask-image:linear-gradient(to_bottom,white_70%,transparent_100%)]
                            [-webkit-mask-image:linear-gradient(to_bottom,white_60%,transparent_100%)]
                            "
                        />

                      
                    </div>
                </div>
            </div>
    </main>
  )
}

export default KevinLandingPage
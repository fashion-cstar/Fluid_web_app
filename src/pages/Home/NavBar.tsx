/* eslint-disable react-hooks/exhaustive-deps */

export const NavBar = () => {

    return (
        <div className="w-full p-4 fixed top-0 flex justify-around">
            <div className='flex items-center justify-center gap-4'>
                <img src="/images/fluid_logo.svg" alt="FLUID" />
                <div className='text-[50px] text-black font-semibold'>FLUID</div>
            </div>
            <div className='flex flex-col gap-5 justify-center items-end'>
                <div className='flex gap-8 items-center'>
                    <a href="#">
                        <img src="/images/facebook.svg" />
                    </a>
                    <a href="#">
                        <img src="/images/twitter.svg" />
                    </a>
                    <a href="#">
                        <img src="/images/telegram.svg" />
                    </a>

                    <div className="dropdown">
                        <div className="border-b-2 border-[#61B8E6] flex gap-2 items-center cursor-pointer">
                            <span className='text-[16px] text-black font-semibold uppercase'>ENG</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="15.167" height="8.998" viewBox="0 0 15.167 8.998">
                                <path id="Path_13" data-name="Path 13" d="M1864,104l6.169,6.169,6.169-6.169" transform="translate(-1862.586 -102.586)" fill="none" stroke="#35bbea" strokeLinecap="round" strokeWidth="2" />
                            </svg>
                        </div>
                        <div className="dropdown-content">
                            <div className='mt-2 rounded-xl bg-[#F9F9F9] py-2 px-8'>
                                <div className='text-[16px] text-black font-semibold uppercase cursor-pointer'>ENG</div>
                            </div>
                        </div>
                    </div>

                </div>
                <div className='flex gap-8 items-center'>
                    <div className='flex gap-10 px-7 py-4 rounded-[16px] bg-white'>
                        <a href="#">
                            <span className='text-[18px] text-[#051C42] font-semibold uppercase'>FLUID</span>
                        </a>
                        <a href="#">
                            <span className='text-[18px] text-[#051C42] font-semibold uppercase'>Tokenomy</span>
                        </a>
                        <a href="#">
                            <span className='text-[18px] text-[#051C42] font-semibold uppercase'>Team</span>
                        </a>
                        <a href="#">
                            <span className='text-[18px] text-[#051C42] font-semibold uppercase'>Roadmap</span>
                        </a>
                        <a href="#">
                            <span className='text-[18px] text-[#051C42] font-semibold uppercase'>Documentation</span>
                        </a>
                        <a href="#">
                            <span className='text-[18px] text-[#051C42] font-semibold uppercase'>FAQ</span>
                        </a>
                        <a href="#">
                            <span className='text-[18px] text-[#051C42] font-semibold uppercase'>Contact</span>
                        </a>
                        <a href="#">
                            <span className='text-[18px] text-[#051C42] font-semibold uppercase'>News</span>
                        </a>
                    </div>
                    <div className="dropdown flex flex-col justify-end">
                        <div className="bg-[#3FBCE9] rounded-full flex gap-2 items-center py-3 pl-12 pr-4 cursor-pointer">
                            <span className='text-[18px] text-white font-semibold uppercase'>Launch App</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="12.227" height="6.133" viewBox="0 0 12.227 6.133">
                                <path id="Path_1135" data-name="Path 1135" d="M-6812.93,204l5.783,5.092,5.783-5.092" transform="translate(6813.261 -203.625)" fill="none" stroke="#fff" strokeWidth="1" />
                            </svg>
                        </div>
                        <div className="dropdown-content">
                            <div className='mt-2 rounded-xl bg-[#F9F9F9] py-2 px-8'>
                                <div className='text-[28px] text-black font-normal cursor-pointer'>Investors</div>
                                <hr className='color-black' />
                                <div className='text-[28px] text-black font-normal cursor-pointer'>Public</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

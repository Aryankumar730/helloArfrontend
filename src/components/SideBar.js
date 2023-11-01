import React from 'react';
import Icon from "../assets/Icon.svg";
import LogoutIcon from "../assets/logoutIcon.svg";
import { useNavigate } from 'react-router-dom';

export default function SideBar() {

    const navigate = useNavigate();

    function onClickLogout(){

        navigate('/');
    }


    return (
        <div className=' border-r-[1px] border-borderCol pt-10 h-[100%] min-w-[255px] relative'>

            <div>
                <p className='text-center text-primary font-bold text-4xl'>Logo</p>
            </div>

            <div className=' flex gap-[10px] items-center bg-[#E6F7FF] pr-[60px] py-4 pl-6  text-sideBarTextHoverCol cursor-pointer mt-4
            border-r-4 border-sideBarTextHoverCol' >


                <img src={Icon} alt="Profile" className=' w-[16px] h-[16px]' />
                <p className=' text-base font-medium tracking-tight'>
                    Songs
                </p>
            </div>

            <div className='flex gap-[10px] items-center hover:bg-[#E6F7FF] pr-[60px] py-4 pl-6 w-full cursor-pointer mt-4 absolute bottom-0 '>

                <img src={LogoutIcon} alt="Profile" className=' w-[16px] h-[16px]' />
                <p className=' text-base font-medium tracking-tight' onClick={onClickLogout}>
                    Logout
                </p>

            </div>

        </div>
    )
}

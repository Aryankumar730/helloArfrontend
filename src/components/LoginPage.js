import { React, useState, useContext, useEffect } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import dataContext from '../context/DataContext';


export default function LoginPage() {

  const navigate = useNavigate();

  const context = useContext(dataContext);
  const { phoneNum, setPhoneNumber, onSubmitPhoneNum } = context;

  const [valid, setValid] = useState(false);
  const [temp, setTemp] = useState(false);

  function validatePhoneNumber(phoneNumber) {

    const phoneNumberPattern = /^\d{12}$/;
    console.log(phoneNumber);

    if (phoneNumberPattern.test(phoneNumber)) {
      setValid(true)
    }
    else {
      setValid(false);
    }
  }

  function handleChange(value) {
    setPhoneNumber(value);
    validatePhoneNumber(value)
  }


  async function onSubmitPhoneNumber(e) {
    e.preventDefault();

    setTemp(true);

    const responseId = onSubmitPhoneNum();

    if (responseId) {
      navigate('/otp');
      Cookies.set('Number', phoneNum.slice(-10));
    }

  }

  useEffect(() => {

    if(phoneNum){
      validatePhoneNumber(phoneNum)
    }

  },[])

  return (
    <div className='h-full w-full flex flex-1 items-center justify-center '>

      <div className='flex flex-col max-w-[414px]  gap-5'>

        <div className='flex flex-col max-w-[414px]'>

          <p className=' text-[38px] font-medium text-primary'>Sign In</p>

          <p className=' text-xs font-normal text-secondary mt-2'>Please enter your mobile number to login. We will send an OTP to verify your number.</p>

        </div>

        <div>
          <PhoneInput country={'in'} value={phoneNum} onChange={handleChange} className='Input min-w-[414px]' inputProps={{
            name: 'phone',
            required: true,
          }}

            inputStyle={{ minWidth: "414px", minHeight: "50px", marginLeft: "10px" }}

            buttonStyle={{ backgroundColor: "white", minWidth: "40px", borderRight: "none", paddingLeft: "10px" }} />


          {!valid && temp ?
            <p className="text-sm font-normal text-red-500 mt-1">Please enter a valid number</p>
            :
            <p></p>
          }

        </div>


        <button className='text-lg font-bold bg-primary disabled:bg-slate-400 rounded-xl text-white min-h-[50px] min-w-[422px]'
          disabled={!valid} onClick={onSubmitPhoneNumber}>Sign In</button>

      </div>

    </div>
  )
}

import { React, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import dataContext from '../context/DataContext';

export default function OtpPage() {

  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const context = useContext(dataContext);
  const { phoneNum, responseId, onSubmitPhoneNum } = context;

  const InputStyle = () => {
    const form = document.querySelector("#otp-form");
    const inputs = document.querySelectorAll(".inputBox");

    const verifyOTPButton = () => {
      let text = "";
      inputs.forEach((input, index) => {
        if (index <= 3) {
          text += input.value;
        }
      });

      setCode(text);
    };



    const resetFilledClass = () => {
     
      // if (errorBox.innerHTML.length !== 0) {
      //   Array.from(inputs).forEach((element) => {
      //     element.classList.remove("inputBox_borderRed");

      //   });
      // }
      
    };

    form.addEventListener("input", (e) => {
      const target = e.target;

      if (target.nextElementSibling) {
        target.nextElementSibling.focus();
      }
      verifyOTPButton();
    });

    inputs.forEach((input, currentIndex) => {



      // paste event
      input.addEventListener("paste", (e) => {
        e.preventDefault();
        const text = e.clipboardData.getData("text");
        verifyOTPButton();
        inputs.forEach((item, index) => {
          if (index >= currentIndex && text[index - currentIndex]) {
            item.focus();
            item.value = text[index - currentIndex] || "";

            verifyOTPButton();
          }
        });
      });

      // backspace event
      input.addEventListener("keydown", (e) => {
        setError(false);
        if (e.keyCode === 8) {
          e.preventDefault();
          input.value = "";
          // console.log(input.value);

          if (input.previousElementSibling) {
            input.previousElementSibling.focus();
          }
        } else {
          if (input.value && input.nextElementSibling) {
            input.nextElementSibling.focus();
          }
        }
        verifyOTPButton();
        resetFilledClass();
      });
    });

    window.addEventListener("load", () => {
      inputs[0].focus();
    });
  };

  const onOtpChange = (e) => {
    !/[0-9]/.test(e.key) && e.preventDefault();
    // setOtp({ ...otp, [e.target.name]: e.target.value });
  };


  useEffect(() => {
    InputStyle();
  }, [])

  function onClickUseAnotherNumber() {

    Cookies.remove('Number');
    navigate('/');
  }

  async function onSubmitOtp(e) {
    e.preventDefault();

    try {

      const response = await fetch(`https://dev.api.goongoonalo.com/v1/auth/verify_otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'

        },
        body: JSON.stringify({ phoneNumber: `+${phoneNum}`, requestId: responseId, otp: code })

      });

      const json = await response.json();
      console.log(json);
      if (json) {
        navigate('/home');
      }

    }
    catch {
      if (code === "5678") {
        navigate('/home');
      }
      else {
        setError(true);
      }

    }


  }

  return (
    <div className='h-full w-full flex flex-1 items-center justify-center '>

      <div className='flex flex-col max-w-[414px]  gap-5'>

        <div className='flex flex-col max-w-[414px]'>

          <p className=' text-[38px] font-medium text-primary'>OTP Verification</p>

          <p className=' text-xs font-normal text-secondary mt-2'>We have sent and OTP to +919889898989. Please enter the code received to verify.</p>

        </div>

        <form action="" className="" id="otp-form">
          <div className="flex flex-row items-center justify-between gap-4 w-full">
            <input
              className="border-[1px] h-[75px] rounded-lg w-[75px] border-otpBoxColor Input text-center text-xl outline-none inputBox"
              type="number"
              maxLength="1"
              required
              onChange={onOtpChange}
              name="first"
            />
            <input
              className="border-[1px] h-[75px] rounded-lg w-[75px] border-otpBoxColor Input text-center text-xl outline-none inputBox"
              type="number"
              maxLength="1"
              required
              onChange={onOtpChange}
              name="second"
            />
            <input
              className="border-[1px] h-[75px] rounded-lg w-[75px] border-otpBoxColor Input text-center text-xl outline-none inputBox"
              type="number"
              maxLength="1"
              max="9"
              min="1"
              required
              onChange={onOtpChange}
              name="third"
            />
            <input
              className="border-[1px] h-[75px] rounded-lg w-[75px] border-otpBoxColor Input text-center text-xl outline-none inputBox"
              type="number"
              maxLength="1"
              required
              onChange={onOtpChange}
              name="forth"
            />
            <input
              className="hidden inputBox"
              type="number"
              maxLength="1"
              required
              onChange={onOtpChange}
              name="fifth"
              style={{ color: "white" }}
            />
          </div>
          <div>
            {error &&
              <p
                className="text-sm font-normal text-red-500 mt-1"
                id="errorMessage"
              >
                Please enter a valid otp
              </p>
            }
          </div>
        </form>

        <button className=' text-lg font-bold bg-primary rounded-xl text-white min-h-[50px] min-w-[422px]' onClick={onSubmitOtp}>Verify</button>

        <div className=' text-secondary font-light text-base flex justify-center flex-col items-center gap-4'>

          <p className='border-b-[1px] border-secondary leading-none cursor-pointer' onClick={onSubmitPhoneNum}> Resend OTP</p>

          <p className='border-b-[1px] border-secondary leading-none cursor-pointer' onClick={onClickUseAnotherNumber}>Use another number</p>

        </div>


      </div>

    </div>
  )
}

import { React, useState, useRef, useEffect } from 'react';
import { Modal, Box } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useFormik } from "formik";
import * as Yup from "yup";
import uploadIcon from '../assets/uploadIcon.svg';
import deleteIcon from '../assets/DeleteIcon.svg';
import playIcon from '../assets/playIcon.svg';
import backIcon from '../assets/back.svg';
import forwardIcon from '../assets/forward.svg';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import styles from "../AudioPlayer.module.css";
import PauseIcon from '@mui/icons-material/Pause';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: "12px",
    bgcolor: 'white',
    outline: 0,
    margin: "20px 0px 20px 0px"
};



export default function SongSection() {

    const inputRef = useRef(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [data, setData] = useState([]);

    const formik = useFormik({
        initialValues: {
            songName: " ",
            songLink: " ",
            songSource: " ",
        },

        validationSchema: Yup.object({
            songName: Yup.string()
                .max(100, " Song name must be 100 characters or less.")
                .min(2, " Song name must be 2 characters or long")
                .required(" Song name is required"),
            songLink: Yup.string()
                .max(500, " Song link must be 500 characters or less.")
                .min(2, " Song link must be 2 characters or long")
                .required(" Song link is required"),
            songSource: Yup.string()
                .max(100, " Song source must be 100 characters or less.")
                .min(2, " Song source must be 2 characters or long")
                .required(" Song source is required"),
        }),

        onSubmit: () => {

            setIsModalOpen(false);

            const newData = {
                songName: formik.values.songName,
                songLink: formik.values.songLink,
                songSource: formik.values.songSource,
                image: selectedFile
            };

            setData([...data, newData]);

            formik.resetForm();
            setSelectedFile(null);
        },
    });

    const changeHandler = (event) => {
        setSelectedFile(event.target.files[0]);



    };

    function handleImageClick(e) {
        e.preventDefault();
        inputRef.current.click();
    }

    const handleCancel = () => {
        setIsModalOpen(false);
        formik.resetForm();
    };

    function onClickDeleteRecord(name) {
        const updatedData = data.filter((obj) => obj.songName !== name);
        setData(updatedData);
    }

    const TruncatedString = (text) => {
        if (text.length > 20) {
            return text.slice(0, 20) + '...';
        }
    };



    // AUDIO PLAYER


    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [currentSongLink, setCurrentSongLink] = useState("");
    const [currentSongImage, setCurrentSongImage] = useState(null);
    const [currentSongTitle, setCurrentSongTitle] = useState("");

    // references
    const audioPlayer = useRef();   // reference our audio component
    const progressBar = useRef();   // reference our progress bar
    const animationRef = useRef();  // reference the animation

    useEffect(() => {
        const seconds = Math.floor(audioPlayer.current.duration);
        setDuration(seconds);
        progressBar.current.max = seconds;
    }, [audioPlayer?.current?.loadedmetadata, audioPlayer?.current?.readyState]);

    const calculateTime = (secs) => {
        const minutes = Math.floor(secs / 60);
        const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
        const seconds = Math.floor(secs % 60);
        const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
        return `${returnedMinutes}:${returnedSeconds}`;
    }

    const togglePlayPause = () => {
        const prevValue = isPlaying;
        setIsPlaying(!prevValue);
        if (!prevValue) {
            audioPlayer.current.play();
            animationRef.current = requestAnimationFrame(whilePlaying)
        } else {
            audioPlayer.current.pause();
            cancelAnimationFrame(animationRef.current);
        }
    }

    const whilePlaying = () => {
        progressBar.current.value = audioPlayer.current.currentTime;
        changePlayerCurrentTime();
        animationRef.current = requestAnimationFrame(whilePlaying);
    }

    const changeRange = () => {
        audioPlayer.current.currentTime = progressBar.current.value;
        changePlayerCurrentTime();
    }

    const changePlayerCurrentTime = () => {
        progressBar.current.style.setProperty('--seek-before-width', `${progressBar.current.value / duration * 100}%`)
        setCurrentTime(progressBar.current.value);
    }

    const backThirty = () => {
        progressBar.current.value = Number(progressBar.current.value - 30);
        changeRange();
    }

    const forwardThirty = () => {
        progressBar.current.value = Number(progressBar.current.value + 30);
        changeRange();
    }

    function onClickPlayCurrentRecord(element) {

        setCurrentSongLink(element.songLink);

        setCurrentSongImage(element.image);

        setCurrentSongTitle(element.songName)

        togglePlayPause();
    }

    useEffect(() => {

        if(data.length == 1){
            setCurrentSongLink(data[0].songLink)
        }

    },[data])

    

    return (


        <div className='w-full relative'>

            <>
                <Modal open={isModalOpen} onClose={handleCancel} aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description" >

                    <Box sx={{ ...style, width: { xs: "100vw", sm: "50%" } }}>

                        <div className="">

                            <div className='flex p-4 justify-between items-center border-b-[2px] border-borderCol'>

                                <p className='text-modelHeader font-bold text-base tracking-[-0.72px]'>Add Song</p>

                                <CloseIcon onClick={handleCancel} className='cursor-pointer' />

                            </div>

                            <div className='p-[30px]'>
                                <div className="flex flex-col">
                                    <label htmlFor="songName" className="text-sm font-normal text-modelHeader">
                                        Song Name
                                    </label>

                                    <input
                                        className={`my-[6px]  ${formik.touched.songName && formik.errors.songName
                                            ? "inputFieldError"
                                            : "inputField"
                                            } `}
                                        type="text"
                                        name="songName"
                                        placeholder=""
                                        id="songName"
                                        onChange={formik.handleChange}
                                        value={formik.values.songName}
                                        onBlur={formik.handleBlur}
                                    />

                                    {formik.errors.songName && formik.touched.songName ? (
                                        <p className="text-sm font-normal text-red-500 mb-2">
                                            {formik.errors.songName}
                                        </p>
                                    ) : (
                                        <p></p>
                                    )}
                                </div>

                                <div className="flex flex-col">
                                    <label htmlFor="songLink" className="text-sm font-normal text-modelHeader">
                                        Song Link
                                    </label>

                                    <input
                                        className={`my-[6px]  ${formik.touched.songLink && formik.errors.songLink
                                            ? "inputFieldError"
                                            : "inputField"
                                            } `}
                                        type="text"
                                        name="songLink"
                                        placeholder=""
                                        id="songLink"
                                        onChange={formik.handleChange}
                                        value={formik.values.songLink}
                                        onBlur={formik.handleBlur}
                                    />

                                    {formik.errors.songLink && formik.touched.songLink ? (
                                        <p className="text-sm font-normal text-red-500 mb-2">
                                            {formik.errors.songLink}
                                        </p>
                                    ) : (
                                        <p></p>
                                    )}
                                </div>

                                <div className="flex flex-col">
                                    <label htmlFor="songSource" className="text-sm font-normal text-modelHeader">
                                        Song Source
                                    </label>

                                    <input
                                        className={`my-[6px]  ${formik.touched.songSource && formik.errors.songSource
                                            ? "inputFieldError"
                                            : "inputField"
                                            } `}
                                        type="text"
                                        name="songSource"
                                        placeholder=""
                                        id="songSource"
                                        onChange={formik.handleChange}
                                        value={formik.values.songSource}
                                        onBlur={formik.handleBlur}
                                    />

                                    {formik.errors.songSource && formik.touched.songSource ? (
                                        <p className="text-sm font-normal text-red-500 mb-2">
                                            {formik.errors.songSource}
                                        </p>
                                    ) : (
                                        <p></p>
                                    )}
                                </div>

                                <div className="flex flex-col mt-3">

                                    <div className='flex flex-row gap-4 p-2 border-[1px] border-[#D9D9D9] rounded-[5px] max-w-[261px]
                                    ' onClick={handleImageClick}>

                                        <img src={uploadIcon} alt="Profile" className=' w-[16px] h-[16px]' />

                                        <p className="text-sm font-normal text-modelHeader">Click to Upload Profile Thumbnail</p>

                                    </div>

                                    <form className='rounded-lg p-1 hidden'>
                                        <fieldset>
                                            <input name="image" type="file" ref={inputRef} onChange={changeHandler} accept=".jpeg, .png, .jpg"
                                            />
                                        </fieldset>
                                    </form>

                                    {selectedFile &&

                                        <div className='flex flex-row justify-between items-center p-3 border-[1px] border-[#D9D9D9] rounded-[5px] w-full mt-3'>


                                            <div className='flex flex-row gap-2 items-center '>
                                                <img
                                                    src={URL.createObjectURL(selectedFile)}
                                                    height={50}
                                                    width={50}
                                                    style={{ objectFit: "contain", borderRadius: "5px" }}
                                                    alt='img'
                                                />

                                                <p className=' text-[#1890FF] text-sm font-normal'>{selectedFile.name}</p>

                                            </div>

                                            <img src={deleteIcon} alt="Profile" className=' w-[16px] h-[16px]' onClick={(e) => { e.preventDefault(); setSelectedFile(null) }} />
                                        </div>
                                    }

                                    <p className=' text-sm font-normal mt-2' style={{ color: "rgba(0, 0, 0, 0.45)" }}>
                                        Image has to be of aspect ratio 1:1 with a size of 3000 pixels x 3000 pixels
                                    </p>

                                </div>



                            </div>


                            <div className='p-4 flex justify-end gap-4 w-full border-t-[1px] border-borderCol'>


                                <button className='rounded-md border-[1px] border-borderCol p-2 text-modelHeader text-sm font-bold tracking-[-0.28px] w-[100px] h-[44px] text-center' onClick={() => { setIsModalOpen(false) }}>Cancel</button>


                                <button className='rounded-md p-2 bg-[#1890FF] text-white text-sm font-bold tracking-[-0.28px] w-[100px] h-[44px] text-center'
                                    onClick={() => { formik.handleSubmit(); }}>Add &nbsp;</button>


                            </div>
                        </div>
                    </Box>
                </Modal>
            </>

            <div className='linkSection py-4 px-12 font-normal text-sm'>

                <span style={{ color: "rgba(0, 0, 0, 0.45)" }}>First-level Menu / Second-level Menu / </span>
                <span style={{ color: "rgba(0, 0, 0, 0.85)" }}>Current Page</span>

            </div>

            <div className='headerSection py-4 px-12 flex flex-row justify-between w-full border-b-[1px] border-borderCol'>

                <span className='text-xl font-medium'> Songs</span>

                <button className='py-[5px] px-[16px] rounded-sm bg-mainSectionPrimary text-sm font-normal' onClick={() => { setIsModalOpen(true) }}>Add Songs</button>

            </div>

            <div className='w-full'>

                <TableContainer component={Paper}>
                    <Table sx={{ width: "100%" }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>SONG NAME</TableCell>
                                <TableCell align="center">SOURCE</TableCell>
                                <TableCell align="center">ADDED ON</TableCell>
                                <TableCell align="right"></TableCell>
                                <TableCell align="right"></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((element) => (
                                <TableRow
                                    key={element.songName}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">

                                        <div className='flex flex-row gap-2 items-center'>
                                            <img
                                                src={URL.createObjectURL(element.image)}
                                                height={50}
                                                width={50}
                                                style={{ borderRadius: "5px" }}
                                                alt='img'
                                            />
                                            <p>{element.songName}</p>

                                        </div>
                                    </TableCell>
                                    <TableCell align="center">{TruncatedString(element.songLink)}</TableCell>
                                    <TableCell align="center">{element.songSource}</TableCell>
                                    <TableCell align="center" onClick={() => { onClickPlayCurrentRecord(element) }}> <img src={playIcon} alt="PlayIcon" className=' w-[40px] h-[40px] ml-28 cursor-pointer' />  </TableCell>
                                    <TableCell align="center" onClick={() => { onClickDeleteRecord(element.songName) }}> <img src={deleteIcon} alt="DeleteIcon" className=' w-[14px] h-[14px] mr-10 cursor-pointer' /> </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>


            </div>


            <div className='absolute bottom-0 w-full'>

                <div className="flex flex-col">

                    {/* progress bar */}
                    <div>
                        <input type="range" className={styles.progressBar} defaultValue="0" ref={progressBar} onChange={changeRange} />
                    </div>




                    <div className='flex flex-row justify-between pr-4'>

                            <div className='flex flex-row gap-2 items-center pl-2'>
                                {currentSongImage &&
                                    <>
                                        <img
                                            src={URL.createObjectURL(currentSongImage)}
                                            height={50}
                                            width={50}
                                            style={{ borderRadius: "5px" }}
                                            alt='img'
                                        />
                                        <p>{currentSongTitle}</p>
                                    </>
                                }

                            </div>
                        

                        <div className='flex flex-row'>
                            <audio ref={audioPlayer} src={currentSongLink} preload="metadata"></audio>

                            <button className={styles.forwardBackward} onClick={backThirty}>

                                <img src={backIcon} alt="backIcon" className=' w-[24px] h-[24px] cursor-pointer' />

                            </button>
                            <button onClick={togglePlayPause} className={styles.playPause} disabled={currentSongLink == ""}>
                                {isPlaying ? <PauseIcon /> : <PlayCircleIcon className={styles.play} />}
                            </button>
                            <button className={styles.forwardBackward} onClick={forwardThirty}>

                                <img src={forwardIcon} alt="backIcon" className=' w-[24px] h-[24px] cursor-pointer' />
                            </button>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

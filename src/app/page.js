"use client";
import styles from "./page.module.css";
import {MdQrCode2, MdTextFields, MdOutlineSquare, MdPalette, MdImage, MdSave, MdFileUpload, MdCheck} from 'react-icons/md';
import {IoMdEye, IoMdEyeOff} from 'react-icons/io';
import Section from "./components/section";
import React, { useEffect, useRef, useState } from "react";
import FrameSelector from "./components/frame-selector";
import "@fontsource/roboto";
import DomToImage from "dom-to-image";
import QRCode from "react-qr-code";
import { HslStringColorPicker } from "react-colorful";
import Image from "next/image";

export default function Home() {
  const url = useRef('');
  const qrElementRef = React.createRef();
  const inputRef = React.createRef();
  const [frame, setFrame] = useState(0);
  const [border, setBorder] = useState(null);
  const [foreground, setForeground] = useState('hsl(0, 0%, 0%)');
  const [background, setBackground] = useState('hsl(0, 0%, 100%)');
  const [isGenerated, setIsGenerated] = useState(0);
  const [file, setFile] = useState(null);
  const [showFile, setShowFile] = useState(true);
  const [loadedLogo, setLoadedLogo] = useState(false);
  const [activeSection, setActiveSection] = useState('text');

  const GetResultQr = () => {
    if (isGenerated > 0) {
      return <QRCode level="H" format={'png'} fgColor={getActualColor(foreground, 'fg')} bgColor={getActualColor(background, 'bg')} size={'100%'} style={{aspectRatio: 1}} value={url.current} />
    }
    return <MdQrCode2 size={'100%'} />
  }

  const GetDownloadButton = () => {
    const isDisabled = !(isGenerated > 0) || file && showFile && !loadedLogo
  
    return (
      <button disabled={isDisabled} className={`flex justify-center items-center gap-2 py-3 text-2xl font-bold text-slate-100 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 rounded-md ${isDisabled ? "opacity-50" : ""}`} 
        onClick={() => isDisabled ? {} : download()}>
        <MdSave />
        <p>Save</p>
      </button>
    )
  }

  const download = async () => {
    DomToImage.toBlob(qrElementRef.current)
      .then(blob => {
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.download = 'my-qr.png'
        link.href = url
        link.click()
      });
  }

  const handleFileChange = e => {
    if (e.target.files.length > 0) {
      setFile(URL.createObjectURL(e.target.files[0]));
    }
  };

  const QrLogo = () => {
    if (file && showFile) {
      return (
        <div className={`absolute items-center top-1/2 left-1/2 w-1/5 -translate-x-1/2 -translate-y-1/2 ${loadedLogo ? "flex" : "hidden"}`}>
          <Image onLoad={() => {
            setTimeout(() => {
              setLoadedLogo(true)
            }, 700);
            }} 
            style={{
              width: '100%',
              height: 'auto',
            }}
            src={file} width={0} height={0} alt="XD" />
          <div className={styles['loader-container']} style={{display: loadedLogo ? 'none' : 'block'}}>
            <p>Please wait...</p>
          </div>
        </div>
      )
    }
    return null
  }

  const getActualColor = (color, layer) => {
    if (color !== 'hsl(0, 0%, 0%)' && color !== 'hsl(0, 0%, 100%)') {
      const colorValues = ((color.replace('hsl(', '')).replace(')', '')).split(', ')
      const hue = colorValues[0];

      if (layer === 'fg')
        return `hsl(${hue}, 100%, 40%)`
      else
        return `hsl(${hue}, 100%, 90%)`
    }
    return color
  }

  return (
    <div className="mx-auto min-h-screen max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between md:gap-8 xl:gap-32 md:px-4 pb-8 md:py-16 lg:py-32">
        <main className="w-full lg:w-3/4 flex flex-col gap-0.5 md:gap-8">
          <Section icon={<MdTextFields />} text="URL / Text" defaultActive={true} activeSection={activeSection} setActiveSection={setActiveSection} tag={"text"} content={
            <div className="w-full h-16 md:h-auto gap-2 flex items-center">
              <input className="w-full p-1 border border-slate-600 bg-slate-200 text-lg text-slate-900 focus:outline-none focus-visible:ring-2 ring-blue-300" defaultValue={url.current} maxLength={140} placeholder={'https://react-qr-creator.vercel.app'} onChange={e => url.current = e.target.value}/>
              <button className="px-2 rounded-sm p-1 text-lg font-bold bg-slate-500 hover:bg-slate-400 active:bg-slate-600 text-slate-100" onClick={() => {
                  if (url.current.length > 0) {
                    setIsGenerated(isGenerated + 1)
                  }
                }}>
                  <p>GO!</p>
                </button>
            </div>
          } />
          <Section icon={<MdOutlineSquare />} text="Frame" activeSection={activeSection} setActiveSection={setActiveSection} tag={"frame"} content={
            <FrameSelector frame={frame} setFrame={setFrame} setBorder={setBorder} />
          } />
          <Section icon={<MdPalette />} text="Foreground color" activeSection={activeSection} setActiveSection={setActiveSection} tag={"fg"} content={
            <div className={"w-full items-center flex gap-4 h-16 md:h-auto"}>
              <button 
                onClick={() => {
                  setForeground('hsl(0, 0%, 0%)');
                }}
                className="w-8 aspect-square rounded-sm"
                style={{
                  backgroundColor: '#000',
                  boxShadow: foreground === 'hsl(0, 0%, 0%)' ? '0 0 0 2px #fffc' : 'none'}}>
                <MdCheck size={'100%'} color="#fff" style={{display: foreground === 'hsl(0, 0%, 0%)' ? 'block' : 'none'}} />
              </button>
              <div className={styles['fg-container']} style={{width: '100%'}}>
                <HslStringColorPicker className={`${styles['react-colorful']}`} style={{opacity: 1}} color={foreground} onChange={color => setForeground(color)} />
              </div>
            </div>
          } />
          <Section icon={<MdPalette />} text="Background color" activeSection={activeSection} setActiveSection={setActiveSection} tag={"bg"} content={
            <div className={"w-full items-center flex gap-4 h-16 md:h-auto"}>
              <button
                onClick={() => {
                  setBackground('hsl(0, 0%, 100%)');
                }}
                className="w-8 aspect-square rounded-sm"
                style={{
                  backgroundColor: '#fff',
                  boxShadow: background === 'hsl(0, 0%, 100%)' ? '0 0 0 2px #000c' : 'none'}}>
                <MdCheck size={'100%'} color="#000" style={{display: background === 'hsl(0, 0%, 100%)' ? 'block' : 'none'}} />
              </button>
              <div className={styles['bg-container']} style={{width: '100%'}}>
                <HslStringColorPicker className={styles['react-colorful']} color={background} onChange={color => setBackground(color)} />
              </div>
            </div>
          }/>
          <Section icon={<MdImage />} text="Custom logo" activeSection={activeSection} setActiveSection={setActiveSection} tag={"logo"} content={
            <div className="w-full items-center gap-4 flex justify-between h-16 md:h-auto">
              <input style={{display: 'none'}} ref={inputRef} type="file" onChange={e => handleFileChange(e)} />
              <button className="flex w-fit h-1/2 md:h-full items-center gap-1.5 rounded-sm bg-slate-500 text-xl text-slate-100 px-4 hover:bg-slate-400 active:bg-slate-600" onClick={() => inputRef.current.click()}>
                <MdFileUpload />
                <p className="font-bold">Load</p>
              </button>
              <div className="flex w-full h-1/2 md:h-full gap-2">
                <input className="w-full h-full px-2 italic bg-slate-600 text-slate-200/60" type="text" disabled value={file ? file.name : 'No image yet'} />
                <button disabled={file === null} className={`w-9 text-2xl text-slate-100 flex justify-center items-center rounded-sm aspect-square bg-sky-500 ${file === null ? "opacity-50" : "hover:bg-sky-400 active:bg-sky-600"}`} onClick={() => setShowFile(!showFile)}>
                  {showFile ? <IoMdEyeOff /> : <IoMdEye />}
                </button>
              </div>
            </div>
          }/>
        </main>
        <div className="flex justify-center items-center w-full max-w-xs mx-auto">
          <div className="flex flex-col gap-4 md:rounded-lg p-8 md:bg-slate-800">
            <div className="relative p-3" ref={qrElementRef}
            style={{
                  color: getActualColor(foreground, 'fg'),
                  backgroundColor: getActualColor(background, 'bg'),
                  borderWidth: 12,
                  borderColor: border ? getActualColor(foreground, 'fg') : 'transparent',
                  borderRadius: border && border.includes('rounded') ? 16 : 0,
                  borderStyle: border && border.includes('dashed') ? 'dashed' : 
                                border && border.includes('solid') ? 'solid' : 'solid', 
                  }} >
                  <GetResultQr/>
                  <QrLogo />
            </div>
            <GetDownloadButton />
            <div className="w-full flex justify-center">
              <p className="max-w-5xl text-slate-200/65 leading-tight"><span className="font-bold">Disclaimer</span>: Please remember that low contrast or unusual color combinations may result in scanning issues on some devices. We recommend testing your QR code on multiple scanners to ensure compatibility.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

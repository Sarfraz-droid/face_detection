/* eslint-disable @next/next/no-img-element */
"use client"

import React, { useEffect } from "react"
import Script from "next/script"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import FaceMarker from "@/components/home/FaceMarker"
import useManager from "@/components/hooks/useManager"

export default function IndexPage() {
  const { camera, image } = useManager()
  return (
    <section className="container grid flex-col items-center gap-6 pb-8 pt-6 text-4xl font-bold md:py-10">
      <h1>Face Detector App</h1>
      <div className="grid h-[375px] w-full grid-cols-2">
        <video ref={camera.videoRef} className="self-center" />
        <div className="flex flex-col items-center justify-start">
          <img
            ref={image.imageRef}
            alt="Image"
            style={{
              display: image.isUploaded ? "block" : "none",
            }}
            className="h-[375px] w-auto self-center object-contain"
          />
        </div>
      </div>
      <canvas ref={camera.webCamCanvas} className="hidden" />
      <canvas ref={image.imageCanvas} className="hidden" />
      {camera.isOn &&
        camera.faces.map((face, index) => {
          return (
            <FaceMarker
              key={index}
              face={face}
              root={camera.videoRef.current}
            />
          )
        })}

      {image.isUploaded &&
        image.faces.map((face, index) => {
          return (
            <FaceMarker key={index} face={face} root={image.imageRef.current} />
          )
        })}

      <div className="flex items-center justify-center gap-5">
        <Button
          variant={camera.isOn ? "destructive" : "default"}
          onClick={() => {
            camera.toggleCamera(() => {
              image.updateImageMarkers()
            })
          }}
        >
          {camera.isOn ? "Close" : "Open"} Camera
        </Button>
        <Separator orientation="vertical" />
        <input
          type="file"
          hidden
          ref={image.imageInput}
          onChange={(e) => {
            image.onImageInputClick(e)
          }}
        />
        <Button
          variant={image.isUploaded ? "destructive" : "ghost"}
          onClick={image.uploadImage}
        >
          {image.isUploaded ? "Remove Image" : "+ Upload a File"}
        </Button>
      </div>
    </section>
  )
}

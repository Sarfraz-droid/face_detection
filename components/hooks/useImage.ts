import { useState, useRef } from 'react'
import useTF from './useTF';

function useImage() {
    const imageRef = useRef<HTMLImageElement | null>(null);
    const imageCanvas = useRef<HTMLCanvasElement | null>(null);
    const imageInput = useRef<HTMLInputElement | null>(null);
    const [isUploaded, setIsUploaded] = useState<boolean>(false);

    const tf = useTF();

    const uploadImage = async () => {
        if (imageInput.current === null)
            throw new Error("No Upload Input Found")
        await tf.configureTF();
        setIsUploaded(!isUploaded);
        if (!isUploaded)
            imageInput.current.click();
        else {
            const img = imageInput.current;
            if (img === null) return;
            img.src = "";
            tf.clearFaces();
        }
    }



    const onImageInputClick = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files == null) return;
        const targetFile = files[0];

        const reader = new FileReader();
        reader.readAsDataURL(targetFile);
        setIsUploaded(true);

        reader.onload = () => {
            const img = imageRef.current

            if (img == null || reader.result == null) return;
            img.src = reader.result as string;

            setTimeout(() => {
                updateImageMarkers();
            }, 200)
        }

        reader.onerror = () => {
            throw new Error("Error Occured while parsing image")
        }
    }

    const updateImageMarkers = () => {
        if (imageRef.current) {
            let img = imageRef.current;
            let photo = imageCanvas.current;
            if (img == null || photo == null) return;
            let ctx = photo.getContext("2d");
            if (ctx == null) return;
            const width = img.clientWidth;
            const height = img.clientHeight;
            photo.width = width;
            photo.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            tf.estimateImages(photo, imageRef.current)
        }
    }

    return {
        imageRef,
        imageInput,
        imageCanvas,
        uploadImage,
        onImageInputClick,
        isUploaded,
        updateImageMarkers,
        ...tf
    }
}

export default useImage

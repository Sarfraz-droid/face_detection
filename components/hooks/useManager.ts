import React, { useEffect } from 'react'
import useCamera from './useCamera'
import useImage from './useImage'

function useManager() {
    const camera = useCamera()
    const image = useImage()

    return {
        camera,
        image
    }
}

export default useManager

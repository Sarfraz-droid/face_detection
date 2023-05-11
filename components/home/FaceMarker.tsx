import React, { useMemo } from "react"

import { FaceStroke } from "@/types/TF.types"

function FaceMarker({
  face,
  root,
}: {
  face: FaceStroke
  root: HTMLElement | null
}) {
  const styles = useMemo(() => {
    if (root == null) return {}
    const rect = root.getBoundingClientRect()
    return {
      left: face.left + rect.x,
      top: face.top + rect.y,
      width: face.width,
      height: face.height,
    }
  }, [root, face])

  return (
    <div
      className="absolute border-4 border-orange-600 transition-all"
      style={styles}
    />
  )
}

export default FaceMarker

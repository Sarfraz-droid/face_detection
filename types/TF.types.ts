export interface IFace {
    boundingBox: {
        height: number;
        width: number;
        originX: number;
        originY: number;
    };
    categories: Array<{
        score: number;
        index: number;
        categoryName: string;
        displayName: string;
    }>
    keypoints: Array<any>
}

export interface FaceStroke {
    top: number;
    left: number;
    height: number;
    width: number;
}

import "./style.scss";
import React from "react";
type mgShape = "circle" | "square";
interface Props {
    src: string;
    width: string | number;
    height: string | number;
    className: string;
    zoomImgSrc: string;
    zoomFactor: number;
    mgWidth: number;
    mgHeight: number;
    mgBorderWidth: number;
    mgShape: mgShape;
    mgShowOverflow: boolean;
    mgMouseOffsetX: number;
    mgMouseOffsetY: number;
    mgTouchOffsetX: number;
    mgTouchOffsetY: number;
}
declare const Magnifier: React.FC<Props>;
export default Magnifier;
//# sourceMappingURL=Magnifier.d.ts.map
export enum TitlePosition {
    TOP,
    BOTTOM,
    TOP_LEFT,
    TOP_RIGHT,
    BOTTOM_LEFT,
    BOTTOM_RIGHT
}

const TL_CORNER = "┌";
const TR_CORNER = "┐";
const BL_CORNER = "└";
const BR_CORNER = "┘";
const HORIZONTAL = "─";
const VERTICAL = "│";

interface IOptions {
    width: number;
    height: number;
    title: string;
    titlePosition?: TitlePosition;
}

export const Window = (options: IOptions) => {
    const { width, height, title, titlePosition } = options;
    const insideWidth = width - 2;

    const output = [];
    const emptyRow = `${VERTICAL}${" ".repeat(insideWidth)}${VERTICAL}`; // │ ... │

    if (title.length === 0){
        output.push(`${TL_CORNER}${HORIZONTAL.repeat(insideWidth)}${TR_CORNER}`); // ${TR_CORNER}─ ... ──${TR_CORNER}
        for (let i = 0; i < insideWidth - 1; i++) {
            output.push(emptyRow);
        }
        output.push(`${BL_CORNER}${HORIZONTAL.repeat(insideWidth)}${BR_CORNER}`); // ${BL_CORNER}─ ... ──${BR_CORNER}
        return output;
    }

    const isTitleTruncated = title.length > width - 6; // leave space for ${TR_CORNER}─ and ─${TR_CORNER}
    const safeTitle = isTitleTruncated ? `${title.substring(0, width - 9)}...` : title;
    const safeTitleWidth = safeTitle.length;
    const dashesNeeded = width - safeTitleWidth - 5;
    const halfDashesNeeded = Math.floor(dashesNeeded / 2);

    if (isTitleTruncated && [TitlePosition.TOP, TitlePosition.TOP_LEFT, TitlePosition.TOP_RIGHT].includes(titlePosition)){
        output.push(`${TL_CORNER}${HORIZONTAL} ${safeTitle} ${HORIZONTAL}${TR_CORNER}`);
    } else if (titlePosition === TitlePosition.TOP_LEFT) {
        output.push(`${TL_CORNER}${HORIZONTAL} ${safeTitle} ${HORIZONTAL.repeat(dashesNeeded)}${TR_CORNER}`);
    } else if (titlePosition === TitlePosition.TOP_RIGHT) {
        output.push(`${TL_CORNER}${HORIZONTAL.repeat(dashesNeeded)} ${safeTitle} ${HORIZONTAL}${TR_CORNER}`);
    } else if (titlePosition === TitlePosition.TOP || titlePosition === undefined) {
        output.push(`${TL_CORNER}${HORIZONTAL.repeat(halfDashesNeeded)} ${safeTitle} ${HORIZONTAL.repeat(dashesNeeded - halfDashesNeeded + 1)}${TR_CORNER}`);
    } else {
        output.push(`${TL_CORNER}${HORIZONTAL.repeat(insideWidth)}${TR_CORNER}`);
    }

    const insideHeight = height - 2;
    for (let i = 0; i < insideHeight - 1; i++) {
        output.push(emptyRow);
    }

    if (isTitleTruncated && [TitlePosition.BOTTOM, TitlePosition.BOTTOM_LEFT, TitlePosition.BOTTOM_RIGHT].includes(titlePosition)){
        output.push(`${BL_CORNER}${HORIZONTAL} ${safeTitle} ${HORIZONTAL}${BR_CORNER}`);
    } else if (titlePosition === TitlePosition.BOTTOM_LEFT) {
        output.push(`${BL_CORNER}${HORIZONTAL} ${safeTitle} ${HORIZONTAL.repeat(dashesNeeded)}${BR_CORNER}`);
    } else if (titlePosition === TitlePosition.BOTTOM_RIGHT) {
        output.push(`${BL_CORNER}${HORIZONTAL.repeat(dashesNeeded)} ${safeTitle} ${HORIZONTAL}${BR_CORNER}`);
    } else if (titlePosition === TitlePosition.BOTTOM) {
        output.push(`${BL_CORNER}${HORIZONTAL.repeat(halfDashesNeeded)} ${safeTitle} ${HORIZONTAL.repeat(dashesNeeded - halfDashesNeeded + 1)}${BR_CORNER}`);
    } else {
        output.push(`${BL_CORNER}${HORIZONTAL.repeat(insideWidth)}${BR_CORNER}`);
    }

    return output;
}
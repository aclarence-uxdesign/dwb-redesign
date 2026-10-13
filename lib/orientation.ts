export type Orientation = "landscape" | "portrait";

/** Pick the board from the window and, when the page fills the panel, from the TV itself. */
export function orientationForDisplay(input: {
  viewWidth: number;
  viewHeight: number;
  screenWidth: number;
  screenHeight: number;
}): Orientation {
  if (input.viewHeight > input.viewWidth) return "portrait";

  const screenPortrait = input.screenHeight > input.screenWidth;
  const viewArea = input.viewWidth * input.viewHeight;
  const screenArea = Math.max(1, input.screenWidth * input.screenHeight);
  const coversScreen = viewArea > screenArea * 0.72;
  if (screenPortrait && coversScreen) return "portrait";

  return "landscape";
}

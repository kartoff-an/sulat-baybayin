import { alphabetCharacters } from "../data/alphabetData";
import { type BaybayinCharacter } from "../types/alphabet";

interface Point {
  x: number;
  y: number;
}

/**
 * Parse SVG path string into array of points
 */
export const parseSVGPath = (pathString: string): Point[] => {
  const points: Point[] = [];
  const commands = pathString.match(/[MLQCZ][^MLQCZ]*/g) || [];

  let currentX = 0;
  let currentY = 0;

  commands.forEach((cmd: string) => {
    const type = cmd[0];
    const coords = cmd
      .slice(1)
      .trim()
      .split(/[\s,]+/)
      .map(Number);

    if (type === "M") {
      currentX = coords[0];
      currentY = coords[1];
      points.push({ x: currentX, y: currentY });
    } else if (type === "L") {
      for (let i = 0; i < coords.length; i += 2) {
        currentX = coords[i];
        currentY = coords[i + 1];
        points.push({ x: currentX, y: currentY });
      }
    } else if (type === "C" || type === "Q") {
      const stepCount = 20;
      const cpCount = type === "C" ? 3 : 2;
      const controlPoints: Point[] = [];

      controlPoints.push({ x: currentX, y: currentY });

      for (let i = 0; i < cpCount - 1; i++) {
        controlPoints.push({ x: coords[i * 2], y: coords[i * 2 + 1] });
      }

      currentX = coords[(cpCount - 1) * 2];
      currentY = coords[(cpCount - 1) * 2 + 1];
      controlPoints.push({ x: currentX, y: currentY });

      for (let i = 0; i <= stepCount; i++) {
        const t = i / stepCount;
        const point = bezierInterpolation(controlPoints, t);
        points.push(point);
      }
    } else if (type === "Z") {
      if (points.length > 0) {
        points.push({ ...points[0] });
      }
    }
  });

  return points;
};

/**
 * Bezier curve interpolation
 */
const bezierInterpolation = (points: Point[], t: number): Point => {
  if (points.length === 1) return points[0];

  const newPoints: Point[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    newPoints.push({
      x: points[i].x + (points[i + 1].x - points[i].x) * t,
      y: points[i].y + (points[i + 1].y - points[i].y) * t,
    });
  }

  return bezierInterpolation(newPoints, t);
};

/**
 * Get all writing characters from alphabet data
 */
export const getWritingCharacters = (): BaybayinCharacter[] => {
  return alphabetCharacters.filter(
    (char) => char.strokes && char.strokes.length > 0
  );
};

/**
 * Get stroke description based on character and stroke index
 */
export const getStrokeDescription = (
  charId: string,
  strokeIndex: number
): string => {
  const descriptions: Record<string, string[]> = {
    a: [
      "Draw a vertical line from top to bottom",
      "Draw a curved line on the right side",
    ],
    i: ["Draw the upper hook", "Draw the lower curve"],
    u: ["Draw the circular shape"],
    ba: ["Draw the top curve", "Draw the body curve"],
    ka: ["Draw the top angle", "Draw the left curve", "Draw the right curve"],
  };

  return (
    descriptions[charId]?.[strokeIndex] ||
    `Follow the guide for stroke ${strokeIndex + 1}`
  );
};

/**
 * Determine stroke direction from path
 */
export const getStrokeDirection = (path: string): string => {
  if (path.includes("Q") || path.includes("C")) return "curve";
  if (path.includes("L")) return "line";
  return "stroke";
};

/**
 * Get start point from SVG path
 */
export const getStartPoint = (
  path: string
): { x: number; y: number } | undefined => {
  const match = path.match(/M\s+([\d.]+)\s+([\d.]+)/);
  if (match) {
    return { x: parseFloat(match[1]), y: parseFloat(match[2]) };
  }
  return undefined;
};

/**
 * Get end point from SVG path
 */
export const getEndPoint = (
  path: string
): { x: number; y: number } | undefined => {
  const points = parseSVGPath(path);
  return points.length > 0 ? points[points.length - 1] : undefined;
};

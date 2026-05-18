import { parseSVGPath } from "../writing";
import { getNDollarAdapter, type Point } from "./adapter";

const DEBUG = true;

const log = (...args: any[]) => {
  if (DEBUG) {
    console.log("[StrokeRecognition]", ...args);
  }
};

interface CharacterStrokeCache {
  characterId: string;
  strokes: Point[][];
  registered: boolean;
}

const strokeCache: Map<string, CharacterStrokeCache> = new Map();
let isInitialized = false;

/**
 * Register a character's strokes with the $N recognizer
 */
export const registerCharacterStrokes = (
  characterId: string,
  strokes: Point[][]
): void => {
  const adapter = getNDollarAdapter();
  log(
    `Registering "${characterId}" (${strokes.length} strokes, ${strokes.flat().length} points)`
  );

  if (strokes[0] && strokes[0].length > 0) {
    log(
      `   First point: (${strokes[0][0].x.toFixed(1)}, ${strokes[0][0].y.toFixed(1)})`
    );
    log(
      `   Last point: (${strokes[0][strokes[0].length - 1].x.toFixed(1)}, ${strokes[0][strokes[0].length - 1].y.toFixed(1)})`
    );
  }

  adapter.registerCharacter(characterId, strokes);

  strokeCache.set(characterId, {
    characterId,
    strokes: strokes.map((stroke) => [...stroke]),
    registered: true,
  });
  log(`Registered "${characterId}" successfully`);
};

/**
 * Pre-register all writing characters from alphabet data
 */
export const initializeRecognizer = (
  characters: Array<{ id: string; strokes: any[] }>
): void => {
  if (isInitialized) {
    log("Recognizer already initialized, skipping");
    return;
  }

  const adapter = getNDollarAdapter();
  adapter.clearUserGestures();
  strokeCache.clear();

  log(`Initializing recognizer with ${characters.length} characters...`);

  characters.forEach((character, idx) => {
    const strokePoints: Point[][] = character.strokes.map((stroke) =>
      parseSVGPath(stroke.path)
    );
    adapter.registerCharacter(character.id, strokePoints);
    strokeCache.set(character.id, {
      characterId: character.id,
      strokes: strokePoints,
      registered: true,
    });
    log(
      `   ${idx + 1}. "${character.id}" - ${character.strokes.length} strokes`
    );
  });

  isInitialized = true;
  log(`Initialized with ${characters.length} characters total`);
};

/**
 * Validate a COMPLETE character by comparing all strokes at once
 */
export const validateCompleteCharacter = (
  userStrokes: Point[][],
  expectedCharacterId: string
): { isValid: boolean; confidence: number; matchName: string } => {
  if (!userStrokes || userStrokes.length === 0) {
    log("No strokes provided for validation");
    return { isValid: false, confidence: 0, matchName: "" };
  }

  const adapter = getNDollarAdapter();
  const totalPoints = userStrokes.flat().length;
  log(
    `Validating "${expectedCharacterId}" - ${userStrokes.length} strokes, ${totalPoints} points`
  );

  // Log user stroke details
  userStrokes.forEach((stroke, idx) => {
    if (stroke.length > 0) {
      log(
        `   Stroke ${idx + 1}: ${stroke.length} points, from (${stroke[0].x.toFixed(1)},${stroke[0].y.toFixed(1)}) to (${stroke[stroke.length - 1].x.toFixed(1)},${stroke[stroke.length - 1].y.toFixed(1)})`
      );
    }
  });

  const result = adapter.recognizeMultistroke(userStrokes);

  const isValid = result.name === expectedCharacterId && result.score >= 50;
  const confidence = result.name === expectedCharacterId ? result.score : 0;

  log(`Recognition result:`);
  log(`   Expected: "${expectedCharacterId}"`);
  log(`   Got: "${result.name}"`);
  log(`   Score: ${result.score.toFixed(2)}%`);
  log(`   Time: ${result.time}ms`);
  log(`   Threshold: 50%`);
  log(
    `   ${isValid ? "MATCH! Character recognized correctly" : "NO MATCH! Character not recognized"}`
  );

  if (!isValid && result.name !== expectedCharacterId) {
    log(
      `   Confusion: Got "${result.name}" instead of "${expectedCharacterId}"`
    );
  }

  return {
    isValid,
    confidence,
    matchName: result.name,
  };
};

/**
 * Calculate accuracy for a completed character
 */
export const calculateCharacterAccuracy = (
  userStrokes: Point[][],
  expectedCharacterId: string
): number => {
  log(`Calculating accuracy for "${expectedCharacterId}"...`);
  const result = validateCompleteCharacter(userStrokes, expectedCharacterId);
  log(`Final accuracy: ${result.confidence.toFixed(1)}%`);
  return result.confidence;
};

/**
 * Reset reference frames (maintained for compatibility)
 */
export const resetReferenceFrames = (): void => {
  log("Reference frames reset");
};

/**
 * Generate target points from SVG path
 */
export const generateTargetPoints = (
  pathString: string,
  numPoints: number = 64
): Point[] => {
  const points = parseSVGPath(pathString);
  log(`Generated ${points.length} target points from path`);
  return points;
};


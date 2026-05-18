import { NDollarRecognizer, Point as NPoint } from "./ndollar";

export interface Point {
  x: number;
  y: number;
}

export interface RecognitionResult {
  name: string;
  score: number;
  time: number;
}

const DEBUG = true;

const log = (...args: any[]) => {
  if (DEBUG) {
    console.log("[NDollar]", ...args);
  }
};

class NDollarAdapter {
  private recognizer: any;
  private useBoundedRotationInvariance: boolean;
  private requireSameNoOfStrokes: boolean;
  private useProtractor: boolean;

  constructor(
    useBoundedRotationInvariance: boolean = true,
    requireSameNoOfStrokes: boolean = true,
    useProtractor: boolean = true
  ) {
    this.useBoundedRotationInvariance = useBoundedRotationInvariance;
    this.requireSameNoOfStrokes = requireSameNoOfStrokes;
    this.useProtractor = useProtractor;
    this.recognizer = new NDollarRecognizer(useBoundedRotationInvariance);
    log("Initialized with", {
      useBoundedRotationInvariance,
      requireSameNoOfStrokes,
      useProtractor,
    });
  }

  private convertPoints(points: Point[]): NPoint[] {
    return points.map((p) => new NPoint(p.x, p.y));
  }

  private convertStrokes(strokes: Point[][]): NPoint[][] {
    return strokes.map((stroke) => this.convertPoints(stroke));
  }

  public registerCharacter(characterId: string, strokes: Point[][]): number {
    const nStrokes = this.convertStrokes(strokes);
    const result = this.recognizer.AddGesture(
      characterId,
      this.useBoundedRotationInvariance,
      nStrokes
    );
    log(
      `Registered "${characterId}" with ${strokes.length} strokes, ${nStrokes.length} unistrokes`
    );
    return result;
  }

  public recognizeMultistroke(strokes: Point[][]): RecognitionResult {
    const nStrokes = this.convertStrokes(strokes);
    log(
      `Recognizing ${strokes.length} strokes, total points: ${nStrokes.flat().length}`
    );

    const result = this.recognizer.Recognize(
      nStrokes,
      this.useBoundedRotationInvariance,
      this.requireSameNoOfStrokes,
      this.useProtractor
    );

    log(
      `Result: "${result.Name}" with score ${(result.Score * 100).toFixed(1)}% in ${result.Time}ms`
    );

    return {
      name: result.Name,
      score: result.Score * 100,
      time: result.Time,
    };
  }

  public clearUserGestures(): number {
    const count = this.recognizer.DeleteUserGestures();
    log(`Cleared user gestures, ${count} default gestures remaining`);
    return count;
  }

  public getAllGestures(): string[] {
    const gestures = this.recognizer.Multistrokes.map((g: any) => g.Name);
    log(`Available gestures: ${gestures.join(", ")}`);
    return gestures;
  }
}

let adapterInstance: NDollarAdapter | null = null;

export const getNDollarAdapter = (): NDollarAdapter => {
  if (!adapterInstance) {
    adapterInstance = new NDollarAdapter(true, true, true);
  }
  return adapterInstance;
};

export default NDollarAdapter;

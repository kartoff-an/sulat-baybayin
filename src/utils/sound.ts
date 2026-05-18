import { Audio } from "expo-av";

let correctSound: Audio.Sound | null = null;
let incorrectSound: Audio.Sound | null = null;
let hintSound: Audio.Sound | null = null;

export const loadSounds = async () => {
  try {
    const { sound: correct } = await Audio.Sound.createAsync(
      require("../../assets/audio/correct.mp3"),
      { shouldPlay: false }
    );
    correctSound = correct;

    const { sound: incorrect } = await Audio.Sound.createAsync(
      require("../../assets/audio/incorrect.mp3"),
      { shouldPlay: false }
    );
      incorrectSound = incorrect;
      
      const { sound: hint } = await Audio.Sound.createAsync(
          require("../../assets/audio/hint.mp3"),
          { shouldPlay: false }
      );
      hintSound = hint;

  } catch (error) {
    console.error("Failed to load sounds:", error);
  }
};

export const playCorrectSound = async () => {
  try {
    if (correctSound) {
      await correctSound.setPositionAsync(0);
      await correctSound.playAsync();
    }
  } catch (error) {
    console.error("Failed to play correct sound:", error);
  }
};

export const playIncorrectSound = async () => {
  try {
    if (incorrectSound) {
      await incorrectSound.setPositionAsync(0);
      await incorrectSound.playAsync();
    }
  } catch (error) {
    console.error("Failed to play incorrect sound:", error);
  }
};

export const playHintSound = async () => {
  try {
    if (hintSound) {
      await hintSound.setPositionAsync(0);
      await hintSound.playAsync();
    }
  } catch (error) {
    console.error("Failed to play hint sound:", error);
  }
};

export const unloadSounds = async () => {
  try {
    if (correctSound) {
      await correctSound.unloadAsync();
      correctSound = null;
    }
    if (incorrectSound) {
      await incorrectSound.unloadAsync();
      incorrectSound = null;
    }
  } catch (error) {
    console.error("Failed to unload sounds:", error);
  }
};

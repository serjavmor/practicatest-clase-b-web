import useSound from 'use-sound';

export default function useAudio() {
  const [playCorrect] = useSound('/sounds/correct.wav', { volume: 0.5 });
  const [playIncorrect] = useSound('/sounds/wrong.wav', { volume: 0.5 });
  const [playReward] = useSound('/sounds/reward.wav', { volume: 0.5 });

  return { playCorrect, playIncorrect, playReward };
}

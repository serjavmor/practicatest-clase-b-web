import useSound from 'use-sound';

export default function useAudio() {
  const [playCorrect] = useSound('/sounds/correct.wav', { volume: 0.5 });
  const [playIncorrect] = useSound('/sounds/wrong.wav', { volume: 0.5 });
  const [playReward] = useSound('/sounds/reward.wav', { volume: 0.5 });
  const [playBuy] = useSound('/sounds/buy.wav', { volume: 0.6 });
  const [playMissionComplete] = useSound('/sounds/mission_complete.wav', { volume: 0.6 });
  const [playUnlockCard] = useSound('/sounds/unlock_card.wav', { volume: 0.6 });

  return { playCorrect, playIncorrect, playReward, playBuy, playMissionComplete, playUnlockCard };
}

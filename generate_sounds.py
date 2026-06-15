import wave
import struct
import math

def generate_tone(filename, freq_seq, duration_seq, waveform='sine', sample_rate=44100):
    with wave.open(filename, 'w') as wav_file:
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)
        wav_file.setframerate(sample_rate)

        for freq, duration in zip(freq_seq, duration_seq):
            n_samples = int(sample_rate * duration)
            for i in range(n_samples):
                t = float(i) / sample_rate
                
                # Apply simple envelope (attack and decay)
                env = 1.0
                if i < 0.1 * n_samples:
                    env = i / (0.1 * n_samples)
                elif i > 0.9 * n_samples:
                    env = (n_samples - i) / (0.1 * n_samples)
                
                if waveform == 'sine':
                    value = math.sin(2.0 * math.pi * freq * t)
                elif waveform == 'sawtooth':
                    value = 2.0 * (freq * t - math.floor(0.5 + freq * t))
                elif waveform == 'square':
                    value = 1.0 if math.sin(2.0 * math.pi * freq * t) > 0 else -1.0
                
                # Volume control
                value = value * 0.3 * env
                
                # Pack and write
                packed_value = struct.pack('h', int(value * 32767.0))
                wav_file.writeframes(packed_value)

# Correct: Magical chime (arpeggio up)
generate_tone('public/sounds/correct.wav', [523.25, 659.25, 783.99, 1046.50], [0.05, 0.05, 0.05, 0.2], 'sine')

# Wrong: Car horn / buzz (dissonant low tones)
generate_tone('public/sounds/wrong.wav', [150.0, 140.0], [0.2, 0.4], 'sawtooth')

# Reward: Celebration (longer arpeggio)
generate_tone('public/sounds/reward.wav', [440.0, 554.37, 659.25, 880.0, 1108.73], [0.1, 0.1, 0.1, 0.1, 0.4], 'sine')

print("Sounds generated in public/sounds/")

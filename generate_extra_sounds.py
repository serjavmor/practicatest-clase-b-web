import wave
import struct
import math
import os

def create_tone(filename, duration_ms, freqs, volume=0.5):
    sample_rate = 44100.0
    num_samples = int(sample_rate * (duration_ms / 1000.0))
    
    with wave.open(filename, 'w') as wav_file:
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)
        wav_file.setframerate(sample_rate)
        
        for i in range(num_samples):
            t = float(i) / sample_rate
            value = 0
            for freq in freqs:
                value += volume * math.sin(2.0 * math.pi * freq * t)
            
            # Envelope (fade out)
            env = 1.0 - (i / num_samples)
            value *= env
            
            # Clip
            value = max(min(value, 1.0), -1.0)
            
            packed_value = struct.pack('h', int(value * 32767.0))
            wav_file.writeframes(packed_value)

# Ensure dir
os.makedirs('public/sounds', exist_ok=True)

# 1. Buy sound (cha-ching) - quick high frequency sweep or chords
create_tone('public/sounds/buy.wav', 300, [880, 1108, 1318], 0.3) 

# 2. Mission complete (tada) - short ascending notes
create_tone('public/sounds/mission_complete.wav', 400, [523.25, 659.25, 783.99, 1046.50], 0.3)

# 3. Unlock card (magical shine) - high frequencies
create_tone('public/sounds/unlock_card.wav', 600, [1046.50, 1318.51, 1567.98, 2093.00], 0.2)

print("Generated sounds successfully")

import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  decodeBase64,
  encodeBase64,
  createPcmBlob,
  createWaveBlob,
  decodeAudioData,
} from "@/shared/utils/audioUtils";

describe("audioUtils", () => {
  beforeEach(() => {
    global.atob = vi.fn((s: string) => Buffer.from(s, "base64").toString("binary"));
    global.btoa = vi.fn((s: string) => Buffer.from(s, "binary").toString("base64"));
  });

  describe("encodeBase64 / decodeBase64", () => {
    it("round-trips a byte array", () => {
      const original = new Uint8Array([0, 72, 101, 108, 108, 111, 255]);
      const encoded = encodeBase64(original);
      const decoded = decodeBase64(encoded);
      expect(Array.from(decoded)).toEqual(Array.from(original));
    });

    it("handles empty input", () => {
      const empty = new Uint8Array(0);
      expect(decodeBase64(encodeBase64(empty)).length).toBe(0);
    });
  });

  describe("createPcmBlob", () => {
    it("converts Float32 samples to PCM Int16 base64", () => {
      const samples = new Float32Array([0, 0.5, -0.5, 1, -1]);
      const result = createPcmBlob(samples);
      expect(result.mimeType).toBe("audio/pcm;rate=16000");
      expect(typeof result.data).toBe("string");
      const decoded = decodeBase64(result.data);
      const int16 = new Int16Array(decoded.buffer, decoded.byteOffset, decoded.byteLength / 2);
      expect(int16[0]).toBe(0);
      expect(int16[1]).toBeCloseTo(16384, -1);
      expect(int16[2]).toBeCloseTo(-16384, -1);
      expect(int16[3]).toBe(32767);
      expect(int16[4]).toBe(-32768);
    });

    it("clamps values outside [-1, 1]", () => {
      const samples = new Float32Array([2, -2]);
      const result = createPcmBlob(samples);
      const decoded = decodeBase64(result.data);
      const int16 = new Int16Array(decoded.buffer, decoded.byteOffset, decoded.byteLength / 2);
      expect(int16[0]).toBe(32767);
      expect(int16[1]).toBe(-32768);
    });
  });

  describe("createWaveBlob", () => {
    it("creates a valid WAV blob with RIFF header", () => {
      const pcm = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7]);
      const blob = createWaveBlob(pcm, 16000);
      expect(blob.type).toBe("audio/wav");
      expect(blob.size).toBe(44 + pcm.length);
    });

    it("uses default sample rate of 24000", () => {
      const blob = createWaveBlob(new Uint8Array(100));
      expect(blob.size).toBe(44 + 100);
    });
  });

  describe("decodeAudioData", () => {
    it("decodes interleaved PCM into an AudioBuffer", async () => {
      const mockBuffer = {
        getChannelData: vi.fn(() => new Float32Array(2)),
      };
      const mockCtx = {
        createBuffer: vi.fn(() => mockBuffer),
      } as unknown as AudioContext;

      // 2 channels, 2 frames: samples = [ch0_f0, ch1_f0, ch0_f1, ch1_f1]
      const int16 = new Int16Array([0, 32768, -32768, 16384]);
      const data = new Uint8Array(int16.buffer);

      const result = await decodeAudioData(data, mockCtx, 16000, 2);
      expect(result).toBe(mockBuffer);
      expect(mockCtx.createBuffer).toHaveBeenCalledWith(2, 2, 16000);
      expect(mockBuffer.getChannelData).toHaveBeenCalledTimes(2);
    });
  });
});

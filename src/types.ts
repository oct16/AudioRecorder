export interface RecorderOptions {
    sampleBits: number
    sampleRate: number
    channelCount: 1 | 2
}

export type RecorderStatus = 'PAUSE' | 'RECORDING' | 'STOP'

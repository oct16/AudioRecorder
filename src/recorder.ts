import { RecorderOptions, RecorderStatus } from './types'
import { encodeWAV } from './transform'

export class Recorder {
    status: RecorderStatus
    opts: RecorderOptions

    audioContext: AudioContext
    mediaStream: MediaStream
    processNode: ScriptProcessorNode
    mediaNode: MediaStreamAudioSourceNode

    channelDataArray: Float32Array[] = []
    generatedBlobBlob: Blob
    generatedBlobBlobUrl: string

    constructor(opts?: RecorderOptions) {
        this.setOptions(opts)
    }

    setOptions(opts?: RecorderOptions) {
        const { sampleBits, sampleRate, channelCount } = opts || {}
        this.opts = {
            sampleBits: sampleBits || 16,
            sampleRate: sampleRate || 44100,
            channelCount: channelCount || 1
        }
    }

    private beginRecord() {
        const BUFFER_SIZE = 4096
        this.audioContext = new window.AudioContext({ sampleRate: this.opts.sampleRate })
        this.mediaNode = this.audioContext.createMediaStreamSource(this.mediaStream)

        let createScript = this.audioContext.createScriptProcessor

        this.processNode = createScript.call(
            this.audioContext,
            BUFFER_SIZE,
            this.opts.channelCount,
            this.opts.channelCount
        )

        this.processNode.connect(this.audioContext.destination)
        this.processNode.onaudioprocess = onAudioProcess.bind(this)
        function onAudioProcess(this: Recorder, event: AudioProcessingEvent) {
            const inputBuffer = event.inputBuffer
            const channelData = inputBuffer.getChannelData(0)
            this.channelDataArray.push(channelData.slice())
        }
        this.mediaNode.connect(this.processNode)
    }

    private async initRecorder(): Promise<MediaStream> {
        return new Promise((resolve, reject) => {
            window.navigator.mediaDevices
                .getUserMedia({
                    audio: {
                        sampleRate: this.opts.sampleRate,
                        channelCount: this.opts.channelCount
                    }
                })
                .then(mediaStream => resolve(mediaStream))
                .catch(err => reject(err))
        })
    }

    public async start(opts?: RecorderOptions) {
        this.setOptions(opts)
        this.mediaStream = await this.initRecorder()
        this.beginRecord()
    }

    public stop(): string {
        this.mediaStream.getAudioTracks()[0].stop()
        this.processNode.disconnect()
        this.mediaNode.disconnect()
        const generatedBlobBlob = encodeWAV(this.channelDataArray, this.opts)
        this.generatedBlobBlobUrl = URL.createObjectURL(generatedBlobBlob)
        return this.generatedBlobBlobUrl
    }

    public download(): void {
        if (!this.generatedBlobBlobUrl) {
            return
        }
        const fileName = `${new Date().valueOf()}.wav`
        const link = document.createElement('a')
        link.href = this.generatedBlobBlobUrl
        link.download = fileName
        link.click()
        window.URL.revokeObjectURL(link.href)
    }

    public pause(): void {}

    public resume(): void {}
}

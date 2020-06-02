import replace from '@rollup/plugin-replace'

export const env = () => {
    return [
        replace({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        })
    ]
}

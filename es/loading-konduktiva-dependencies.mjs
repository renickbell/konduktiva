// --------------------------------------------------------------------------
// -- loading-konduktiva-dependencies.mjs
// --------------------------------------------------------------------------

export async function loadKonduktivaDependencies (){
    global['R'] = await import('ramda')
    let perf= await import('perf_hooks');
    global['performance'] = perf.performance
    let TaskTimerDefault = await import('tasktimer');
    const {TaskTimer} = TaskTimerDefault.default
    global['TaskTimer'] = TaskTimer
    global['fs'] = await import('fs')
    global['path'] = await import('path')
    let oscDefault = await import("osc");
    global['osc'] = oscDefault.default
    global['v8'] = await import('v8');
    global['A'] = await import('array-toolkit')
    global['easymidi'] = await import('easymidi')
    let{
        Chord,
        Interval,
        Note,
        Scale,
        Key,
        Progression,
        Midi,
        RomanNumeral,
        Mode
    } = require("tonal")
    global['Chord'] = Chord
    global['Interval'] = Interval
    global['Note'] = Note
    global['Scale'] = Scale
    global['key'] = Key
    global['Progression'] = Progression
    global['Midi'] = Midi
    global['RomanNumeral'] = RomanNumeral
    global['Mode'] = Mode
}

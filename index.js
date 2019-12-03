const defaultName = module.exports.defaultName = 'bezier';

const defaultSegmentsMap = module.exports.defaultSegmentsMap =
Array(4).fill(0).map((v, i) => i+1);

const defaultTypesMap = module.exports.defaultTypesMap =
['float', 'vec2', 'vec3', 'vec4'];


/**
 * Adapted from [`bezier`](https://github.com/hughsk/bezier) for use in generating
 * `glsl` functions.
 */
function makeBezier(segments = 3, type = 'float', name = defaultName) {
    segments = Math.abs(segments | 0);

    if(!segments) {
        throw new Error('Cannot make a interpolator with no elements');
    }
    else {
        let fn = '\n';

        if(segments < 2) {
            fn += '    return cp0;\n';
        }
        else if(segments < 3) {
            fn += '    return mix(cp0, cp1, t);\n';
        }
        else {
            for(let n = segments; n > 0; --n) {
                for(let j = 0; j < n; j++) {
                    if(n+1 === segments) {
                        fn += `    ${type} p${j} = mix(cp${j}, cp${j+1}, t);\n`;
                    }
                    else if(n > 1) {
                        fn += `    p${j} = mix(p${j}, p${j+1}, t);\n`;
                    }
                    else {
                        fn += `    return mix(p${j}, p${j+1}, t);\n`;
                    }
                }

                if(n > 1) {
                    fn += '\n';
                }
            }
        }

        const cps = Array(segments).fill(0).map((v, p) => `in ${type} cp${p}`);

        return `${type} ${name}(${cps.join(', ')}, in float t) {${fn}}\n`;
    }
}

module.exports.makeBezier = makeBezier;


const makeBeziers = (segmentsMap = defaultSegmentsMap, typesMap = defaultTypesMap,
    name) =>
    '/** GLSL generated by `glsl-bezier` */\n\n'+
    typesMap.map((type) =>
            segmentsMap.map((segment) => makeBezier(segment, type, name))
                .join('\n'))
        .join('\n\n')+
    '\n/** End of GLSL generated by `glsl-bezier` */\n';

module.exports.makeBeziers = makeBeziers;

# `bezier-gen`

Bézier curve functions and Node code generator - creates functions with any `mix`-able type/dimension, and any number of control points, for GLSL-like languages.

Made with GLSL in mind, but similar languages may be generated if a suitable `mix` function and behaviour is also provided.

## Usage

### Bézier Functions

This module produces a series of GLSL bézier functions, for each of the given numbers of segments `S`, and overloaded for each of the given types `T`, named `name`, with the signature:
```glsl
T name(T cp0, T cp1, ..., T cp<S-1>, float t);
```

The bézier functions may be called as follows (using functions in the pre-generated `*.glsl` files for example):
```glsl
// From `bezier-gen/1d.glsl`
float interpolated = bezier(0.0, 1.0, 2.0, 0.5); // 1.0

// From `bezier-gen/2d.glsl`
vec2 interpolated = bezier(vec2(0.0), vec2(1.0), vec2(2.0), 0.5); // vec2(1.0)
```

### Generating

You can use the pre-generated `*.glsl` files, or generate your own bézier functions using the generator files:

Using [`bin`](./bin) for command-line:
```bash
# These are equivalent:

# Long form:
bezier-gen/bin --segments 3 4 5 --types float vec2 vec3 vec4 --name bezier --output ./bezier.glsl

# Short form:
bezier-gen/bin -s 3 4 5 -t float vec2 vec3 vec4 -n bezier -o ./bezier.glsl

# Defaults (outputs to console if no `output` file is given):
bezier-gen/bin
```

Using [`index.js`](./index.js) for Node or JavaScript:
```javascript
import { makeBezier, makeBeziers } from 'bezier-gen';

makeBezier(3, 'vec2', 'myBezier') === `
/** GLSL generated by \`bezier-gen\` */

vec2 myBezier(in vec2 cp0, in vec2 cp1, in vec2 cp2, in float t) {
    vec2 p0 = mix(cp0, cp1, t);
    vec2 p1 = mix(cp1, cp2, t);

    return mix(p0, p1, t);
}

/** End of GLSL generated by \`bezier-gen\` */
`

makeBeziers([3, 4], ['float', 'vec2'], 'moreBezier') === `
/** GLSL generated by \`bezier-gen\` */

float moreBezier(in float cp0, in float cp1, in float cp2, in float t) {
    float p0 = mix(cp0, cp1, t);
    float p1 = mix(cp1, cp2, t);

    return mix(p0, p1, t);
}

float moreBezier(in float cp0, in float cp1, in float cp2, in float cp3, in float t) {
    float p0 = mix(cp0, cp1, t);
    float p1 = mix(cp1, cp2, t);
    float p2 = mix(cp2, cp3, t);

    p0 = mix(p0, p1, t);
    p1 = mix(p1, p2, t);

    return mix(p0, p1, t);
}


vec2 moreBezier(in vec2 cp0, in vec2 cp1, in vec2 cp2, in float t) {
    vec2 p0 = mix(cp0, cp1, t);
    vec2 p1 = mix(cp1, cp2, t);

    return mix(p0, p1, t);
}

vec2 moreBezier(in vec2 cp0, in vec2 cp1, in vec2 cp2, in vec2 cp3, in float t) {
    vec2 p0 = mix(cp0, cp1, t);
    vec2 p1 = mix(cp1, cp2, t);
    vec2 p2 = mix(cp2, cp3, t);

    p0 = mix(p0, p1, t);
    p1 = mix(p1, p2, t);

    return mix(p0, p1, t);
}

/** End of GLSL generated by \`bezier-gen\` */
`
```

## See Also

- [`bezier`](https://github.com/hughsk/bezier)
- [`bezier-gen-curve`](https://github.com/yiwenl/bezier-gen-curve)

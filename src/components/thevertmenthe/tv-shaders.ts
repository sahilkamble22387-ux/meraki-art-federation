/* ThevertMenthe — shaders ported from the original site bundle. */

/** Artwork crossfade shader (draw mesh inside every frame). */
export const TV_DRAW_VERTEX = /* glsl */ `
varying vec2 vUv;
void main(){
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;
    vUv = uv;
}`

export const TV_DRAW_FRAGMENT = /* glsl */ `
varying vec2 vUv;
uniform sampler2D u_tex;
uniform sampler2D u_next;
uniform sampler2D u_noise;
uniform float u_progress;

void main()
{
    float noise = texture(u_noise, vUv).r;

    float remapedProgress = 1.0 - abs(u_progress * 2.0 - 1.0);
    noise *= remapedProgress;
    vec2 dir = (vUv-0.5)*1.0;

    vec2 displacedUv = vUv-(dir*noise);

    vec3 tex = texture(u_tex, displacedUv).rgb;
    vec3 next = texture(u_next, displacedUv).rgb;

    float finalProg = smoothstep(0.2, 0.8, u_progress);
    vec3 finalRes = mix(tex, next, finalProg);
    gl_FragColor = vec4(finalRes, 1.0);
}`

/**
 * Ink-flood page transition (port of the original scribble transition:
 * a black ink circle with a noisy edge floods / drains on the screen).
 * uProgress 0 -> 1 with uDir=1 floods the screen with ink,
 * uProgress 1 -> 0 with uDir=0 drains it away.
 */
export const TV_INK_VERTEX = /* glsl */ `
varying vec2 vUv;
void main(){
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`

export const TV_INK_FRAGMENT = /* glsl */ `
varying vec2 vUv;
uniform float uProgress;
uniform float uTime;
uniform float uDir; // 1 = closing (flood in), 0 = opening (drain out)

float hash(vec2 p){
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

float vnoise(vec2 p){
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main(){
    vec2 p = (vUv - 0.5) * 2.0;
    p.x *= 1.9;
    float r = length(p);

    float ang = atan(p.y, p.x);
    float edge = vnoise(vec2(cos(ang), sin(ang)) * 2.2 + uTime * 0.35) * 0.55
               + vnoise(vec2(cos(ang), sin(ang)) * 5.5 - uTime * 0.22) * 0.25;

    float radius;
    float alpha;
    if (uDir > 0.5) {
        // closing: ink circle grows from tiny to covering the screen
        radius = mix(-0.35, 3.4, uProgress);
        alpha = smoothstep(radius + edge - 0.012, radius + edge + 0.012, r);
        alpha = 1.0 - alpha;
    } else {
        // opening: covered screen drains, hole grows
        radius = mix(-0.35, 3.4, uProgress);
        alpha = smoothstep(radius + edge - 0.012, radius + edge + 0.012, r);
    }
    gl_FragColor = vec4(vec3(0.0), alpha);
}`

import { AppConfig, defaultConfig } from "./defaultConfig";

/**
 * Read CLI args of the form "foo.bar=baz" and build
 * a nested object { foo: { bar: 'baz' } }
 */
function parseCommandLineArgs(): Partial<AppConfig> {
  const overrides: any = {};
  for (const arg of process.argv.slice(2)) {
    const eq = arg.indexOf('=');
    if (eq === -1) continue;
    const rawKey = arg.slice(0, eq);
    let rawVal = arg.slice(eq + 1);

    // basic type coercion
    let val: any = rawVal;
    if (rawVal === 'true' || rawVal === 'false') {
      val = rawVal === 'true';
    } else if (!isNaN(+rawVal)) {
      val = +rawVal;
    }

    setNested(overrides, rawKey.split('.'), val);
  }
  return overrides;
}

function setNested(obj: any, path: string[], val: any) {
  let cur = obj;
  for (let i = 0; i < path.length; i++) {
    const key = path[i]!;
    if (i === path.length - 1) {
      cur[key] = val;
    } else {
      cur[key] = cur[key] ?? {};
      cur = cur[key];
    }
  }
}

/**
 * Recursively merge source into target.
 * When both values are objects, merge deeply; otherwise overwrite.
 */
function mergeDeep<T>(target: T, source: Partial<T>): T {
  for (const key of Object.keys(source) as (keyof T)[]) {
    const srcVal = source[key] as any;
    const tgtVal = (target as any)[key];
    if (
      srcVal !== null &&
      typeof srcVal === 'object' &&
      !Array.isArray(srcVal) &&
      tgtVal !== undefined &&
      typeof tgtVal === 'object' &&
      !Array.isArray(tgtVal)
    ) {
      (target as any)[key] = mergeDeep({ ...(tgtVal as object) }, srcVal);
    } else {
      (target as any)[key] = srcVal;
    }
  }
  return target;
}

/**
 * The factory that ConfigModule will call.
 */
export default () => {
  const overrides = parseCommandLineArgs();
  // clone defaults so we don’t mutate the module-scoped defaultConfig
  const merged = mergeDeep({ ...defaultConfig }, overrides);
  return merged;
};
import {isString} from "lodash";

export const isNonEmptyString = o /* (o: unknown): o is string  */=> isString(o) && o.length > 0;

export const areNonEmptyStrings = o /* (o: unknown[]): o is string[] */ => o.every((value) => isNonEmptyString(value));
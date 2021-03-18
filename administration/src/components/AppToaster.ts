import { Position, Toaster } from "@blueprintjs/core";

/** Singleton toaster instance. Create separate instances for different options. */
export const AppToaster = Toaster.create({
    position: Position.BOTTOM,
});

export const LoginToaster = Toaster.create({
    position: Position.TOP,
});


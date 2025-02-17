// eslint-disable-next-line import/no-extraneous-dependencies
import * as Sentry from "@sentry/react";

const initSentry = ():void => {
  Sentry.init({
    dsn: "https://c560d6febb909858b17b92f91d418183@sentry.tuerantuer.org/6",
  });
}

export default initSentry
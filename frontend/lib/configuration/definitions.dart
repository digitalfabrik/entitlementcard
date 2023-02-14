const String appEnvironment = String.fromEnvironment("environment", defaultValue: "staging");

bool isProduction() {
  return appEnvironment == "production";
}

bool isLocal() {
  return appEnvironment == "local";
}

bool isShowcase() {
  return appEnvironment == "showcase";
}

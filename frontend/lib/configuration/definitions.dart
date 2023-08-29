const String showcase = 'showcase';
const String production = 'production';
const String local = 'local';
const String appEnvironment = String.fromEnvironment('environment', defaultValue: showcase);

bool isProduction() {
  return appEnvironment == production;
}

bool isLocal() {
  return appEnvironment == local;
}

bool isShowcase() {
  return appEnvironment == showcase;
}

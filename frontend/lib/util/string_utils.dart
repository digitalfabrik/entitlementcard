String removeTrailingSlash(String value) => value.endsWith('/') ? value.substring(0, value.length - 1) : value;

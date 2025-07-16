import 'package:ehrenamtskarte/build_config/build_config.dart' show buildConfig;
import 'package:flutter/material.dart';
import 'package:flutter_html/flutter_html.dart';
import 'package:url_launcher/url_launcher.dart';

List<Widget> getCopyrightText(BuildContext context) {
  const content = '''
  <p>Der Quelltext dieser App ist unter der MIT Lizenz veröffentlicht und kann unter https://github.com/digitalfabrik/entitlementcard eingesehen werden.</p>
  <p>MIT License</p>
  <p>Copyright (c) 2021 The Entitlementcard Contributors</p>
  <p>Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:</p>
  <p>The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.</p>
  <p>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.</p>
  ''';
  return [Html(data: content, style: _getHtmlStyle())];
}

List<Widget> getDisclaimerText(BuildContext context) {
  return [
    Html(
      data: buildConfig.disclaimerText,
      style: _getHtmlStyle(),
      onLinkTap: (url, attributes, element) => _onLinkTap(url),
    ),
  ];
}

List<Widget> getPublisherText(BuildContext context) {
  return [
    Html(
      data: buildConfig.publisherText,
      style: _getHtmlStyle(),
      onLinkTap: (url, attributes, element) => _onLinkTap(url),
    ),
  ];
}

Map<String, Style> _getHtmlStyle() {
  return {
    '*': Style(fontSize: FontSize(15), letterSpacing: 0.1),
    'p': Style(margin: Margins.only(bottom: 10)),
    'h4': Style(margin: Margins.only(bottom: 10)),
    'li': Style(padding: HtmlPaddings.only(left: 10)),
    'ul': Style(padding: HtmlPaddings.only(left: 20)),
  };
}

void _onLinkTap(String? url) {
  if (url != null) {
    launchUrl(Uri.parse(url), mode: LaunchMode.externalApplication);
  }
}

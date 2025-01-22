import 'package:ehrenamtskarte/build_config/build_config.dart' show buildConfig;
import 'package:flutter/material.dart';
import 'package:flutter_html/flutter_html.dart';
import 'package:url_launcher/url_launcher.dart';

@immutable
class Paragraph {
  const Paragraph({this.title, this.content});

  final String? content;
  final String? title;
}

List<Widget> toWidgets(ThemeData theme, List<Paragraph> paragraphs) {
  return paragraphs
      .map((e) {
        final title = e.title;
        final content = e.content;
        return [
          if (title != null) Text(title, style: theme.textTheme.titleLarge),
          if (content != null) Text(content, style: theme.textTheme.bodyLarge)
        ];
      })
      .expand((i) => i)
      .toList();
}

List<Widget> getCopyrightText(BuildContext context) {
  return toWidgets(Theme.of(context), [
    const Paragraph(
      content: '''
Der Quelltext dieser App ist unter der MIT Lizenz veröffentlicht und kann unter https://github.com/digitalfabrik/entitlementcard eingesehen werden.

MIT License

Copyright (c) 2021 The Entitlementcard Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.''',
    )
  ]);
}

List<Widget> getDisclaimerText(BuildContext context) {
  return toWidgets(Theme.of(context), [Paragraph(content: buildConfig.disclaimerText)]);
}

List<Widget> getPublisherText(BuildContext context) {
  return [
    Html(
      data: buildConfig.publisherText,
      style: {
        'li': Style(
          padding: HtmlPaddings.only(left: 10),
        ),
        'ul': Style(
          padding: HtmlPaddings.only(left: 20),
        ),
      },
      onLinkTap: (url, attributes, element) {
        if (url != null) {
          launchUrl(Uri.parse(url), mode: LaunchMode.externalApplication);
        }
      },
    ),
  ];
}

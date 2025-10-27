package app.ehrenamtskarte.backend.shared.mail

import kotlinx.html.HtmlBlockInlineTag
import kotlinx.html.HtmlBlockTag
import kotlinx.html.a
import kotlinx.html.body
import kotlinx.html.br
import kotlinx.html.html
import kotlinx.html.p
import kotlinx.html.stream.appendHTML
import kotlinx.html.style
import java.net.URI

class EmailBody {
    private val children = ArrayList<Paragraph>(0)

    fun p(builder: Paragraph.() -> Unit) {
        children.add(Paragraph().apply { builder() })
    }

    fun renderHtml(): String =
        StringBuilder().apply {
            appendHTML().html {
                body {
                    for (child in children) {
                        child.renderHtml(this)
                    }
                }
            }
        }.toString()

    fun renderPlain(): String =
        StringBuilder().also { builder ->
            for (child in children) {
                child.renderPlain(builder)
            }
            builder.dropLastWhile { it == '\n' }
        }.toString()
}

fun emailBody(builder: EmailBody.() -> Unit): EmailBody = EmailBody().apply { builder() }

interface InlineRenderable {
    fun renderHtml(parent: HtmlBlockInlineTag)

    fun renderPlain(builder: StringBuilder)
}

private val multipleWhiteSpaces = Regex("\\s+")

class Paragraph {
    private val children: ArrayList<InlineRenderable> = ArrayList(0)

    operator fun String.unaryPlus() {
        children.add(Text(this))
    }

    fun plain(plainText: String) {
        plainText.trim().lines().forEachIndexed { index, text ->
            children.add(if (index != 0) LineBreak() else Text(text))
        }
    }

    fun link(uri: URI) {
        children.add(Link(uri))
    }

    fun br() {
        children.add(LineBreak())
    }

    fun renderHtml(parent: HtmlBlockTag) {
        parent.p {
            for (child in children) {
                child.renderHtml(this)
            }
        }
    }

    fun renderPlain(builder: StringBuilder) {
        val firstIndex = builder.length

        for (child in children) {
            child.renderPlain(builder)
        }

        // Remove leading spaces as these are not rendered by HTML.
        // I.e., `<p> test</p>` should render as `test`.
        if (firstIndex < builder.length && builder[firstIndex] == ' ') {
            builder.removeRange(IntRange(firstIndex, firstIndex + 1))
        }

        if (builder.lastOrNull() == ' ') {
            builder.dropLast(1)
        }
        builder.append("\n\n")
    }
}

class Text(text: String) : InlineRenderable {
    private val text: String = text.replace(multipleWhiteSpaces, " ")

    override fun renderHtml(parent: HtmlBlockInlineTag) {
        parent.text(text)
    }

    override fun renderPlain(builder: StringBuilder) {
        val hasTrailingSpace = builder.lastOrNull() == ' '
        var toAppend = text

        if (hasTrailingSpace && toAppend.startsWith(" ")) {
            toAppend = toAppend.substring(1)
        }

        builder.append(toAppend)
    }
}

class Link(val uri: URI) : InlineRenderable {
    override fun renderHtml(parent: HtmlBlockInlineTag) {
        parent.a(uri.toString()) {
            style = "word-wrap: break-word;"
            +uri.toString()
        }
    }

    override fun renderPlain(builder: StringBuilder) {
        val last = builder.lastOrNull()

        if (last != null && last != ' ' && last != '\n') {
            builder.append(" ")
        }

        builder.append(uri.toString())
        // Always append a space to make the URL stand out in plain text.
        // In the case of a subsequent newline, this space will get removed again.
        builder.append(" ")
    }
}

class LineBreak : InlineRenderable {
    override fun renderHtml(parent: HtmlBlockInlineTag) {
        parent.br
    }

    override fun renderPlain(builder: StringBuilder) {
        if (builder.lastOrNull() == ' ') {
            builder.dropLast(1)
        }

        builder.append("\n")
    }
}

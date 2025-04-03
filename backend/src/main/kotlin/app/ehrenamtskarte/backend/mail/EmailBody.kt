package app.ehrenamtskarte.backend.mail

import kotlinx.html.HtmlBlockInlineTag
import kotlinx.html.HtmlBlockTag
import kotlinx.html.a
import kotlinx.html.body
import kotlinx.html.br
import kotlinx.html.html
import kotlinx.html.p
import kotlinx.html.stream.appendHTML
import kotlinx.html.style
import java.net.URL

class EmailBody {
    private val children = ArrayList<Paragraph>(0)

    fun p(builder: Paragraph.() -> Unit) {
        val paragraph = Paragraph()
        paragraph.builder()
        children.add(paragraph)
    }

    fun renderHtml(): String {
        val builder = StringBuilder()
        builder.appendHTML().html {
            body {
                for (child in children) {
                    child.renderHtml(this)
                }
            }
        }
        return builder.toString()
    }

    fun renderPlain(): String {
        val builder = StringBuilder()
        for (child in children) {
            child.renderPlain(builder)
        }
        builder.dropLastWhile { it == '\n' }
        return builder.toString()
    }
}

fun emailBody(builder: EmailBody.() -> Unit): EmailBody {
    val email = EmailBody()
    email.builder()
    return email
}

interface InlineRenderable {
    fun renderHtml(parent: HtmlBlockInlineTag)

    fun renderPlain(builder: StringBuilder)
}

private val multipleWhiteSpaces = Regex("\\s+")
private val newLine = Regex("\\n+")

private fun handleNewLines(text: String, children: ArrayList<InlineRenderable>) {
    val sentences = text.split(newLine)
    sentences.forEach {
        children.add(Text(it))
        children.add(LineBreak())
    }
}

class Paragraph {
    private val children: ArrayList<InlineRenderable> = ArrayList(0)

    operator fun String.unaryPlus() {
        if (this.contains(newLine)) {
            handleNewLines(this, children)
        } else {
            children.add(Text(this))
        }
    }

    fun link(url: URL) {
        children.add(Link(url))
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

class Link(val url: URL) : InlineRenderable {
    override fun renderHtml(parent: HtmlBlockInlineTag) {
        parent.a(url.toString()) {
            style = "word-wrap: break-word;"
            +url.toString()
        }
    }

    override fun renderPlain(builder: StringBuilder) {
        val last = builder.lastOrNull()
        val shouldPrependSpace = last != null && last != ' ' && last != '\n'
        if (shouldPrependSpace) {
            builder.append(" ")
        }
        builder.append(url.toString())
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
        val last = builder.lastOrNull()
        val hasTrailingSpace = last != null && last == ' '
        if (hasTrailingSpace) {
            builder.dropLast(1)
        }
        builder.append("\n")
    }
}

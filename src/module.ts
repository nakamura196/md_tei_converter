interface Metadata {
  [key: string]: string;
}

class TeiXmlBuilder {
  private metadata: Metadata;
  private bodyXml: string;

  constructor(metadata: Metadata = {}) {
    this.metadata = metadata;
    this.bodyXml = "";
  }

  public addParagraph(text: string, pageNumber?: string): void {
    if (pageNumber) {
      this.bodyXml += `<pb n="${pageNumber}"/>\n`;
    } else {
      this.bodyXml += `<lb/>
    <seg>${text}</seg>\n`;
    }
  }

  public addLineBreak(): void {
    this.bodyXml += "<lb/>\n";
  }

  public finalize(): string {
    const headerXml = `<teiHeader>
      <fileDesc>
        <titleStmt>
          <title>${this.metadata.title || ""}</title>
        </titleStmt>
        <publicationStmt>
          <ab>${this.metadata.publication || ""}</ab>
        </publicationStmt>
        <sourceDesc>
        <ab>${this.metadata.source || ""}</ab>
        </sourceDesc>
      </fileDesc>
    </teiHeader>`;

    const facsimile = this.metadata.manifest
      ? `<facsimile sameAs="${this.metadata.manifest}">
      <surface/>
    </facsimile>`
      : "";

    // XMLドキュメントの終了処理前に、先頭と末尾の<lb/>を削除
    const cleanedBodyXml = this.bodyXml
      .replace(/^\s*<lb\/>\n/, "")
      .replace(/<lb\/>\n\s*$/, "");

    return `<?xml version="1.0" encoding="UTF-8"?>
    <TEI xmlns="http://www.tei-c.org/ns/1.0">
      ${headerXml}
      ${facsimile}
      <text>
        <body>
          <p>${cleanedBodyXml}</p>
        </body>
      </text>
    </TEI>`;
  }
}

function parseFrontMatter(frontMatter: string[]): Metadata {
  const metadata: Metadata = {};
  frontMatter.forEach((line) => {
    // 最初のコロンのみを区切りとして使用
    const index = line.indexOf(":");
    if (index > -1) {
      const key = line.substring(0, index).trim();
      const value = line
        .substring(index + 1)
        .trim()
        .replace(/["']/g, ""); // 引用符を除去
      metadata[key] = value;
    }
  });
  return metadata;
}

function convertTextToTeiXml(text: string): string {
  const normalizedText = text.replace(/\r\n|\r/g, "\n");
  const lines = normalizedText.split("\n");
  let inFrontMatter = false;
  const frontMatter: string[] = [];
  let teiXmlBuilder: TeiXmlBuilder | null = null; // Nullで初期化

  for (const line of lines) {
    if (line.startsWith("===")) {
      inFrontMatter = !inFrontMatter;
      if (!inFrontMatter && frontMatter.length > 0) {
        const metadata = parseFrontMatter(frontMatter);
        teiXmlBuilder = new TeiXmlBuilder(metadata);
      }
      continue;
    } else if (inFrontMatter) {
      frontMatter.push(line);
    } else {
      if (teiXmlBuilder) {
        if (!line.trim()) {
          // すべての空白行に<lb/>を挿入
          teiXmlBuilder.addLineBreak();
        } else {
          // 空白でない行の処理
          const pbMatch = line.match(/<pb n="(\d+)"\/>/);
          if (pbMatch) {
            teiXmlBuilder.addParagraph("", pbMatch[1]);
          } else {
            teiXmlBuilder.addParagraph(line);
          }
        }
      }
    }
  }

  return teiXmlBuilder ? teiXmlBuilder.finalize() : "";
}

export { convertTextToTeiXml };

import { convertTextToTeiXml } from "../src/index";

describe("TeiXmlBuilder", () => {
  test("should generate correct TEI XML for given text", () => {
    const text = `
===
title: Sample Title
publication: Sample Publication
source: Sample Source
===
This is a test paragraph.
`;
    const expectedXmlStart = `<?xml version="1.0" encoding="UTF-8"?>`;
    const expectedTitle = `<title>Sample Title</title>`;

    const result = convertTextToTeiXml(text);
    expect(result).toContain(expectedXmlStart);
    expect(result).toContain(expectedTitle);
    // 他にも期待するXMLの内容が含まれているかテストを追加できます。
  });

  test("should handle line breaks and page breaks correctly", () => {
    const text = `===
title: Sample Title
publication: Sample Publication
source: Sample Source
===
This is a test paragraph.
<pb n="1"/>
This is a second paragraph after a page break.
`;

    const result = convertTextToTeiXml(text);
    expect(result).toContain('<pb n="1"/>');
    // 段落や改行が正しく扱われているかのテストを追加します。
  });
});

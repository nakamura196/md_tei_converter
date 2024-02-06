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
title: きりつぼ
source: 源氏物語
publication: Example Organization
manifest: https://dl.ndl.go.jp/api/iiif/3437686/manifest.json
===

<pb n="5"/>
いつれの御時にか女御更衣あまたさふらひ給けるなかにいとやむことなきゝは
にはあらぬかすくれて時めき給ありけりはしめより我はと思あかり給へる御方
〱めさましきものにおとしめそねみ給おなしほとそれより下らうの更衣たち
はましてやすからすあさゆふの宮つかへにつけても人の心をのみうこかしうら
みをおふつもりにやありけむいとあつしくなりゆきもの心ほそけにさとかちな
るをいよ〱あかすあはれなる物におもほして人のそしりをもえはゝからせ給
はす世のためしにもなりぬへき御もてなし也かんたちめうへ人なともあいなく
めをそはめつゝいとまはゆき人の御おほえなりもろこしにもかゝることのおこ
りにこそ世もみたれあしかりけれとやう〱あめのしたにもあちきなう人のも
てなやみくさになりて楊貴妃のためしもひきいてつへくなりゆくにいとはした
なきことおほかれとかたしけなき御心はへのたくひなきをたのみにてましらひ
給ちゝの大納言はなくなりてはゝ北の方なんいにしへの人のよしあるにておや
うちくしさしあたりて世のおほえはなやかなる御方〱にもいたうおとらすな
にことのきしきをももてなしたまひけれととりたてゝはか〱しきうしろみし


<pb n="6"/>
なけれは事ある時はなをより所なく心ほそけ也さきの世にも御ちきりやふかか
りけむ世になくきよらなるたまのをのこみこさへうまれ給ひぬいつしかと心も
となからせ給ていそきまいらせて御覧するにめつらかなるちこの御かたちなり
一のみこは右大臣の女御の御はらにてよせをもくうたかひなきまうけの君と世
にもてかしつきゝこゆれとこの御にほひにはならひ給へくもあらさりけれはお
ほかたのやむことなき御おもひにてこの君をはわたくし物におもほしかしつき
給事かきりなしはしめよりをしなへてのうへ宮つかへし給へきゝはにはあらさ
りきおほえいとやむことなく上すめかしけれとわりなくまつはさせ給あまりに
さるへき御あそひのおり〱なにことにもゆへあることのふし〱にはまつま
うのほらせ給ある時にはおほとのこもりすくしてやかてさふらはせ給ひなとあ
なかちにおまへさらすもてなさせ給しほとにをのつからかろき方にもみえしを
このみこうまれ給てのちはいと心ことにおもほしをきてたれは坊にもようせす
はこのみこのゐ給へきなめりと一のみこの女御はおほしうたかへり人よりさき
にまいり給てやむことなき御おもひなへてならすみこたちなともおはしませは`;

    const result = convertTextToTeiXml(text);
    // console.log(result);
    expect(result).toContain('<pb n="5"/>');
    // 段落や改行が正しく扱われているかのテストを追加します。
  });
});

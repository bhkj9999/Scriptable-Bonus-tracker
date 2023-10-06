const jsonRequest = async (url) => {
  let data = null;
  let resultResult = null;

  const cacheKey = url;

  try {
    let req = new Request(url);
    data = await req.loadJSON();
    resultResult = true;
  } catch (e) {
    resultResult = false;
  }

  if (!data && Keychain.contains(cacheKey)) {
    let cache = Keychain.get(cacheKey);
    return { data: JSON.parse(cache), result: resultResult };
  }

  Keychain.set(cacheKey, JSON.stringify(data));
  return { data, result: resultResult };
};

const {data, result} = await jsonRequest(
    "https://x23emcpxzpekkp32nb2dk2bzry0kasuv.lambda-url.ap-northeast-2.on.aws/"
);

let widget = new ListWidget();

const nextRefresh = Date.now() + 43200000;
widget.refreshAfterDate = new Date(nextRefresh);

const fonts_style = {
  big_title: Font.title1(),
  bank_title: Font.title2(),
  body: Font.italicSystemFont(12),
  mono_font: Font.regularMonospacedSystemFont(12),
};

const nextUpdateDateObj = new Date(nextRefresh);
let dF = new DateFormatter();
dF.dateFormat = "HH:mm MMM dd yyyy";

const nextUpdateDate = dF.string(nextUpdateDateObj);

const nextUpdateDateString = "Next update at " + nextUpdateDate;

const big_title = widget.addText("本季度返现类别");

const discover_title = widget.addText("Discover IT");

const discover_text = widget.addText(data.discover);

const chase_title = widget.addText("Chase Freedom Flex");
const chase_text = widget.addText(data.chase);

widget.addSpacer();

const lastLine = widget.addStack();

const refreshResultText = lastLine.addText(
  `Result: ${result ? "Success" : "Failed"}`
);
lastLine.addSpacer();
const datetext = lastLine.addText(nextUpdateDateString);

datetext.rightAlignText();

big_title.font = fonts_style.big_title;

discover_title.font = fonts_style.bank_title;
discover_text.font = fonts_style.body;
chase_title.font = fonts_style.bank_title;
chase_text.font = fonts_style.body;

refreshResultText.font = fonts_style.mono_font;
datetext.font = fonts_style.mono_font;

widget.presentMedium();

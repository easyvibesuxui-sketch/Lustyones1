import { DesktopMock } from "./desktop-mock";
import { PhoneMock } from "./phone-mock";
import type { Template } from "@/lib/templates";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

type Props = {
  template: Template;
  mock: Dictionary["mock"];
  planCopy: Dictionary["demo"]["plans"];
  lang: Locale;
  unlocked?: boolean;
};

// The same template on a laptop and a phone: the laptop at the back, the phone in front at the lower right.
// The phone is zoomed by the duo's width so it stays about a quarter of it.
export function DeviceDuo({ template, mock, planCopy, lang, unlocked = false }: Props) {
  return (
    <div className="@container relative">
      <div className="w-[86%] pb-[16%]">
        <DesktopMock template={template} mock={mock} planCopy={planCopy} lang={lang} unlocked={unlocked} />
      </div>
      <div className="absolute bottom-0 right-0 [zoom:0.33] @xs:[zoom:0.41] @sm:[zoom:0.49] @md:[zoom:0.57] @lg:[zoom:0.65] @xl:[zoom:0.73] @2xl:[zoom:0.85]">
        <PhoneMock template={template} mock={mock} lang={lang} unlocked={unlocked} size="small" />
      </div>
    </div>
  );
}

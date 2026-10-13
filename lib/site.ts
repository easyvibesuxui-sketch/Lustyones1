// Studio details shown across the site. Replace the placeholders before launch.
export const site = {
  name: "Unlockd",
  url: "https://unlockd.example",
  contact: {
    email: "hello@unlockd.example",
    telegram: "https://t.me/unlockd_studio",
  },
  // Order form delivery. With a Web3Forms access key (free, made at web3forms.com for the email
  // that should receive orders) briefs are sent straight from the page; without one the form
  // opens the visitor's email app with the brief filled in.
  web3formsKey: "",
  startingPrice: "$490",
  copyrightYear: 2026,
} as const;

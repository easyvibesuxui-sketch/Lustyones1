import type { ReactNode } from "react";
import { Backdrop } from "./page-shell";
import { Keyhole } from "./keyhole";
import { LineArrowDown } from "./icons";

type Props = {
  id: string;
  backdrop: string;
  scene: string;
  number?: number;
  // The id of the chapter below, for the arrow.
  next?: string;
  children: ReactNode;
};

// One full-screen chapter of the home page: a blurred scene, and the same scene seen sharp through a keyhole.
export function Chapter({ id, backdrop, scene, number, next, children }: Props) {
  return (
    <section id={id} className="relative flex min-h-[100svh] items-center overflow-hidden">
      <Backdrop src={backdrop} />
      <div className="relative mx-auto grid w-full max-w-[90rem] items-center gap-12 px-5 pb-28 pt-32 sm:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.7fr)] lg:gap-20 lg:pl-28">
        <div className="relative">
          {number !== undefined && (
            <span
              aria-hidden="true"
              className="numeral parallax pointer-events-none absolute -top-14 left-[40%] text-[7rem] sm:-top-40 sm:left-[35%] sm:text-[15rem] lg:text-[17rem]"
            >
              {String(number).padStart(2, "0")}
            </span>
          )}
          <div className="relative">{children}</div>
        </div>
        <div className="keyhole-in mx-auto w-[min(64vw,20rem)] lg:w-full lg:max-w-[24rem]">
          <Keyhole id={id} src={scene} className="w-full drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)]" />
        </div>
      </div>
      {next && (
        <a
          href={`#${next}`}
          tabIndex={-1}
          aria-hidden="true"
          className="absolute bottom-8 right-8 hidden text-heading/80 transition hover:translate-y-1 hover:text-accent-soft sm:block"
        >
          <LineArrowDown />
        </a>
      )}
    </section>
  );
}

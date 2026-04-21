const joinClasses = (...classes: string[]) => classes.join(" ");

export const actionRowClasses = "flex flex-wrap gap-[14px]";

export const buttonBaseClasses = joinClasses(
  "inline-flex min-h-12 items-center justify-center rounded-full border px-[18px]",
  "transition-[transform,border-color,background-color,color] duration-200 ease-out",
  "hover:-translate-y-px",
);

export const buttonPrimaryClasses = joinClasses(
  "border-[rgba(241,239,234,0.22)] bg-[rgba(241,239,234,0.08)]",
  "text-[var(--text)] shadow-[0_10px_28px_rgba(0,0,0,0.18)]",
);

export const buttonSecondaryClasses =
  "border-[rgba(241,239,234,0.14)] bg-transparent text-[var(--text-soft)]";

export const buttonPaperClasses =
  "border-[#1a1c23] bg-[#1a1c23] text-[#f7f2e9]";

export const buttonPaperSecondaryClasses =
  "border-[rgba(34,31,26,0.16)] bg-transparent text-[var(--ink)]";

export const headerFrameClasses = joinClasses(
  "sticky top-0 z-40 border-b border-white/6 bg-[rgba(7,11,18,0.68)] backdrop-blur-[14px]",
  "max-[760px]:bg-[rgba(7,11,18,0.8)] max-[760px]:backdrop-blur-[10px]",
);

export const headerShellClasses = joinClasses(
  "container grid min-h-[60px] grid-cols-[auto_1fr] items-center gap-5",
  "max-[1080px]:grid-cols-[1fr_auto]",
  "max-[760px]:min-h-14 max-[760px]:grid-cols-[auto_auto] max-[760px]:gap-3",
);

export const headerBrandClasses = joinClasses(
  "inline-flex items-center justify-self-start gap-2.5 leading-none",
  "max-[760px]:gap-2",
);

export const headerBrandImageClasses = "block h-[30px] w-auto max-[760px]:h-6";

export const headerBrandTextClasses = joinClasses(
  "[font-family:'Playfair_Display',serif] text-[1.48rem] leading-none tracking-[0.01em] text-white",
  "max-[760px]:text-[1.24rem]",
);

export const headerNavClasses = joinClasses(
  "flex min-w-0 items-center justify-end gap-5",
  "max-[1080px]:justify-self-end",
  "max-[760px]:gap-3.5",
);

export const headerNavLinkClasses = joinClasses(
  "text-[0.89rem] tracking-[0.01em] text-[rgba(237,231,221,0.82)]",
  "transition-colors duration-200 hover:text-white",
  "max-[760px]:hidden",
);

export const headerCtaClasses = joinClasses(
  buttonBaseClasses,
  "min-h-0 border-white/[0.22] bg-white/[0.03] px-[13px] py-2",
  "text-[0.89rem] tracking-[0.01em] text-[rgba(237,231,221,0.82)] shadow-none",
  "hover:border-white/[0.28] hover:bg-white/[0.05] hover:text-white",
);

export const floatingAcademicCardClasses = joinClasses(
  "pointer-events-auto absolute box-border opacity-0",
  "left-[calc(var(--card-x)+var(--card-offset-x))] top-[calc(var(--card-y)+var(--card-offset-y))]",
  "min-w-[158px] max-w-[172px] -translate-x-1/2 -translate-y-1/2",
  "rounded-[10px] border border-white/10 bg-[rgba(15,20,31,0.46)] px-3 py-2.5",
  "shadow-[0_6px_16px_rgba(0,0,0,0.14)] backdrop-blur-[4px]",
  "transition-[border-color,background-color,box-shadow] duration-300 ease-out",
  "hover:border-white/[0.14] hover:bg-[rgba(18,24,37,0.54)] hover:shadow-[0_8px_18px_rgba(0,0,0,0.16)]",
  "max-[1080px]:min-w-[140px] max-[1080px]:max-w-[154px] max-[1080px]:px-[10px] max-[1080px]:py-[9px]",
  "max-[760px]:static max-[760px]:left-auto max-[760px]:top-auto max-[760px]:w-full",
  "max-[760px]:min-w-0 max-[760px]:max-w-none max-[760px]:translate-x-0 max-[760px]:translate-y-0",
  "max-[760px]:rounded-[10px] max-[760px]:bg-[rgba(15,20,31,0.74)]",
  "max-[760px]:px-[10px] max-[760px]:py-[10px] max-[760px]:shadow-[0_6px_14px_rgba(0,0,0,0.12)]",
  "max-[760px]:backdrop-blur-none",
);

export const floatingAcademicCardLayoutClasses = joinClasses(
  "absolute inset-0 pointer-events-none",
  "max-[760px]:relative max-[760px]:inset-auto max-[760px]:mt-[42px]",
  "max-[760px]:grid max-[760px]:w-full max-[760px]:grid-cols-2 max-[760px]:gap-[10px]",
  "max-[340px]:grid-cols-1",
);

export const academicCardTitleClasses = joinClasses(
  "block text-[1rem] leading-none text-[#f4efe5]",
  "[font-family:'Playfair_Display',serif]",
  "max-[760px]:text-[0.9rem] max-[760px]:leading-[0.98]",
);

export const academicCardListClasses =
  "mt-2 grid gap-[6px] max-[760px]:mt-[7px] max-[760px]:gap-1";

export const academicCardItemClasses = "grid gap-0.5";

export const academicCardTermClasses = joinClasses(
  "text-[0.7rem] uppercase tracking-[0.12em] text-[rgba(186,179,169,0.7)]",
  "max-[760px]:text-[0.64rem] max-[760px]:tracking-[0.1em]",
);

export const academicCardValueClasses = joinClasses(
  "m-0 text-[0.8rem] leading-[1.32] text-[rgba(236,232,225,0.94)]",
  "max-[760px]:text-[0.72rem] max-[760px]:leading-[1.22]",
);

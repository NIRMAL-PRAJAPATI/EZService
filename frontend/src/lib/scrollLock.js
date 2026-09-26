// Page scroll lock shared by every sheet / full-screen overlay.
//
// Each overlay used to save document.body.style.overflow and put it back when it
// closed. When two overlapped (e.g. the instant-search screen and the offer sheet)
// and closed in a different order than they opened, the last one "restored"
// overflow: hidden and the page could not scroll until a reload.
// A counter avoids that: the page scrolls again as soon as no overlay is open.
let locks = 0;

const apply = () => {
  document.body.style.overflow = locks > 0 ? 'hidden' : '';
};

// Locks page scroll and returns a function that releases this lock (safe to call twice).
export const lockScroll = () => {
  locks += 1;
  apply();
  let released = false;
  return () => {
    if (released) return;
    released = true;
    locks = Math.max(0, locks - 1);
    apply();
  };
};

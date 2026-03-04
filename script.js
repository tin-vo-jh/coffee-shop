document.addEventListener('DOMContentLoaded', () => {
    /*
     * NGOPI — script.js
     *
     * Why Vanilla JS and no framework?
     * The page has no dynamic data, no component re-rendering, and no routing.
     * Plain DOM APIs are smaller, faster to parse, and easier to review.
     */

    /* ── Filter Tabs ────────────────────────────────────────────
       Keeps exactly one tab active at a time.
       aria-selected is updated alongside the CSS class so
       screen readers announce the correct selected state.       */
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            /* Deactivate every button first, then re-activate
               only the clicked one — simpler than tracking the
               currently active button in a separate variable.  */
            filterBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');   /* ARIA sync */
            });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');
        });
    });

    /* ── Pagination Dots ────────────────────────────────────────
       Each .dots container is its own independent group so a
       click in Products never affects the Testimonials dots.   */
    document.querySelectorAll('.dots').forEach(group => {
        group.querySelectorAll('.dot').forEach(dot => {
            dot.addEventListener('click', () => {
                group.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));
                dot.classList.add('active');
            });
        });
    });

    /* ── Add-to-Cart Press Feedback ─────────────────────────────
       Briefly scales the button to 90% then snaps back.
       style.transform = '' removes the inline override so
       the CSS transition takes over again on the way back.      */
    document.querySelectorAll('.add-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.style.transform = 'scale(0.9)';
            setTimeout(() => (btn.style.transform = ''), 120);  /* 120 ms feels instant */
        });
    });

    /* ── Subscribe Form ─────────────────────────────────────────
       e.preventDefault() stops the browser's default full-page
       form reload. .trim() rejects whitespace-only input.
       .reset() clears the field after a successful submission.  */
    const subscribeForm = document.querySelector('.subscribe-form');
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', e => {
            e.preventDefault();   /* stop default browser form submit */
            const email = subscribeForm.querySelector('input[type="email"]').value.trim();
            if (email) {
                console.log('Subscribed:', email);   /* swap for a real API call in production */
                subscribeForm.reset();
            }
        });
    }

    /* ════════════════════════════════════════════════════════════
       INTERACTIVE ENHANCEMENTS
       - Floating header on scroll
       - Hamburger toggle + mobile nav slide panel
       - Mobile dropdown accordion (desktop uses CSS :hover)
       - Click-outside collapse
    ════════════════════════════════════════════════════════════ */

    /* ── Floating Header ────────────────────────────────────────
       Adds `.scrolled` to <header> after the user scrolls 10px.
       CSS uses this class to apply the elevation shadow.        */
    const header   = document.querySelector('.header');
    /* classList.toggle(name, force) adds the class when force is truthy
       and removes it when falsy — no extra if/else needed.             */
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
    /* { passive: true } tells the browser this listener will never call
       preventDefault(), allowing it to start scrolling immediately
       without waiting for JS — critical for smooth mobile scrolling.   */
    window.addEventListener('scroll', onScroll, { passive: true });

    /* ── Hamburger & Mobile Nav ─────────────────────────────────
       Toggles `.open` on #nav-links and `.active` on the button.
       `aria-expanded` keeps screen readers in sync.             */
    const hamburger = document.querySelector('.hamburger');
    const navLinks  = document.getElementById('nav-links');

    hamburger.addEventListener('click', () => {
        /* .toggle() returns true when class was ADDED, false when REMOVED,
           so isOpen always reflects the new state without an extra query. */
        const isOpen = navLinks.classList.toggle('open');
        hamburger.classList.toggle('active', isOpen);
        /* aria-expanded expects a string attribute value, not a boolean */
        hamburger.setAttribute('aria-expanded', String(isOpen));   /* "true" / "false" */
    });

    /* Close the mobile nav when any nav link is tapped */
    navLinks.addEventListener('click', e => {
        if (e.target.tagName === 'A' && window.innerWidth <= 768) {
            navLinks.classList.remove('open');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });

    /* ── Mobile Dropdown Accordion ──────────────────────────────
       On desktop the dropdown opens via CSS :hover/:focus-within
       automatically. On mobile we toggle `.open` on the parent
       <li> so the CSS accordion animation can run.              */
    document.querySelectorAll('.has-dropdown > a').forEach(trigger => {
        trigger.addEventListener('click', e => {
            /* Guard: on desktop the dropdown is handled entirely by
               CSS :hover/:focus-within — no JS needed there.         */
            if (window.innerWidth > 768) return;
            e.preventDefault();   /* stop <a> from jumping the page on mobile */
            const parent = trigger.closest('.has-dropdown');   /* nearest <li> ancestor */
            const isOpen = parent.classList.toggle('open');    /* CSS animates max-height */
            trigger.setAttribute('aria-expanded', String(isOpen));
        });
    });

    /* ── Click-Outside Collapse ─────────────────────────────────
       Collapses the mobile nav and any open dropdown when the
       user clicks anywhere outside the header.                  */
    /* One document-level listener is lighter than attaching blur
       handlers to every individual nav element.           */
    document.addEventListener('click', e => {
        /* .closest('.header') returns non-null for any click inside the nav,
           so we bail out early and leave the nav in its current state.     */
        if (e.target.closest('.header')) return;

        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');

        document.querySelectorAll('.has-dropdown').forEach(item => {
            item.classList.remove('open');
            item.querySelector('a').setAttribute('aria-expanded', 'false');
        });
    });

});

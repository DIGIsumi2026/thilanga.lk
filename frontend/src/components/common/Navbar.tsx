import {useEffect, useRef, useState} from 'react';
import {Link,NavLink,useLocation} from 'react-router-dom';
import {Facebook,Linkedin,Mail,Menu,Phone,X} from 'lucide-react';
import {AnimatePresence,motion} from 'framer-motion';
import { imageAssets } from '../../assets/imageAssets';
import BorderGlow from './BorderGlow';

import { contactButtonGlowProps } from './borderGlowPresets';
import { navbarSocialLinks } from './navbarSocialLinks';

const socialIcons = [
  {key: 'facebook', label: 'Facebook', icon: <Facebook size={16} strokeWidth={1.6} />},
  {key: 'x', label: 'X', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3L12 14.6 5.5 22H2.3l7.9-9L.8 2h6.5l4.5 6.7L18.9 2ZM17.8 20h1.7L6.2 4H4.4l13.4 16Z" /></svg>},
  {key: 'linkedin', label: 'LinkedIn', icon: <Linkedin size={16} strokeWidth={1.6} />},
] as const;

const navLinks = [
  {
    label: 'Home',
    path: '/',
  },
  {
    label: 'About Me',
    path: '/about-me',
  },
  {
    label: 'Corporate',
    path: '/corporate',
  },
  {
    label: 'Political',
    path: '/political',
  },
  {
    label: 'Public Relations',
    path: '/public-relations',
  },
  {
    label: 'Contact',
    path: '/contact',
  },
];

type NavbarState = 'top' | 'visible' | 'hidden';

const TOP_THRESHOLD = 40;
const SCROLL_DELTA = 5;
const AUTO_HIDE_DELAY = 2400;

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [navbarState, setNavbarState] =
    useState<NavbarState>('top');

  const lastScrollY = useRef(0);

  const hideTimer = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);

  const isHoveredRef = useRef(false);

  const location = useLocation();

  const clearHideTimer = () => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  };

  const scheduleHide = () => {
    clearHideTimer();

    hideTimer.current = setTimeout(() => {
      if (window.scrollY > TOP_THRESHOLD && !isHoveredRef.current && !menuOpen) {
        setNavbarState('hidden');
      }
    }, AUTO_HIDE_DELAY);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const previousScrollY = lastScrollY.current;

      // nav bar static 
      if (currentScrollY <= TOP_THRESHOLD) {
        clearHideTimer();
        setNavbarState('top');

        lastScrollY.current = currentScrollY;

        return;
      }

      // nav bar scroll
      if (menuOpen || isHoveredRef.current) {
        clearHideTimer();
        setNavbarState('visible');

        lastScrollY.current = currentScrollY;

        return;
      }

      const difference =
        currentScrollY - previousScrollY;

      /*
       * Ignore extremely small movements.
       */
      if (Math.abs(difference) < SCROLL_DELTA) {
        return;
      }

      /*
       * User scrolling DOWN:
       * immediately hide navbar.
       */
      if (difference > 0) {
        clearHideTimer();
        setNavbarState('hidden');
      }

      /*
       * User scrolling UP:
       * show navbar temporarily.
       */
      if (difference < 0) {
        setNavbarState('visible');
        scheduleHide();
      }

      lastScrollY.current = currentScrollY;
    };

    lastScrollY.current = window.scrollY;

    window.addEventListener(
      'scroll',
      handleScroll,
      { passive: true },
    );

    return () => {
      window.removeEventListener(
        'scroll',
        handleScroll,
      );

      clearHideTimer();
    };
  }, [menuOpen]);

  /*
   * Close the mobile menu whenever
   * React Router navigates to another page.
   */
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const breakpoint = window.matchMedia('(max-width: 900px)');
    const resolveLayout = () => {
      clearHideTimer();
      isHoveredRef.current = false;
      lastScrollY.current = window.scrollY;
      if (!breakpoint.matches) setMenuOpen(false);
      // Reset stale desktop hover state without adding a second hide timer.
      setNavbarState(window.scrollY <= TOP_THRESHOLD ? 'top' : 'hidden');
    };
    resolveLayout();
    breakpoint.addEventListener('change', resolveLayout);
    return () => breakpoint.removeEventListener('change', resolveLayout);
  }, []);

  /*
   * Prevent scrolling behind the mobile menu.
   */
  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  const navbarClassName = [
    'site-header',
    navbarState === 'top' && 'is-top',
    navbarState === 'visible' && 'is-scroll-visible',
    navbarState === 'hidden' && 'is-scroll-hidden',
    menuOpen && 'menu-is-open',
  ]
    .filter(Boolean)
    .join(' ');

  const toggleMenu = () => {
    setMenuOpen((current) => {
      const next = !current;

      if (next) {
        clearHideTimer();
        setNavbarState('visible');
      }

      return next;
    });
  };

  const handleMouseEnter = () => {
    isHoveredRef.current = true;
    clearHideTimer();
    if (window.scrollY > TOP_THRESHOLD) {
      setNavbarState('visible');
    }
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    if (window.scrollY > TOP_THRESHOLD && !menuOpen) {
      setNavbarState('hidden');
    }
  };

  return (
    <header 
      className={navbarClassName}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="nav-shell">

        {/* BRAND LOGO */}

        <Link
          to="/"
          className="brand-logo"
          aria-label="Thilanga Sumathipala - Home"
        >
          <img
            src={imageAssets.brand.logo}
            alt="Thilanga Sumathipala"
          />
        </Link>

        {/* NAVIGATION */}

        <nav
          className="desktop-nav"
          aria-label="Main navigation"
        >
          {navLinks.map(({ label, path }) =>
            path === '/contact' ? (
              <BorderGlow
                key={path}
                className="navbar-contact-glow"
                {...contactButtonGlowProps}
              >
                <NavLink
                  to={path}
                  className={({isActive}) =>
                    `nav-contact-link${isActive ? ' active' : ''}`
                  }
                >
                  {label}
                </NavLink>
              </BorderGlow>
            ) : (
              <NavLink
                key={path}
                to={path}
                end={path === '/'}
                className={({ isActive }) =>
                  isActive ? 'active' : undefined
                }
              >
                {label}
              </NavLink>
            ),
          )}
        </nav>

        {/* CONTACT */}

        <div className="nav-contact">

          <a
            href="mailto:info@thilangasumathipala.lk"
            className="nav-email"
            aria-label="Email Thilanga Sumathipala"
            title="info@thilangasumathipala.lk"
          >
            <Mail
              size={17}
              strokeWidth={1.6}
            />
            <span className="nav-email-label">
              info@thilangasumathipala.lk
            </span>
          </a>

          <a
            href="tel:+94112697106"
            className="nav-phone"
            aria-label="Call +94 11 269 7106"
          >
            <Phone
              size={15}
              strokeWidth={1.6}
            />

            <span className="nav-phone-label">
              (+94) 112 697 106
            </span>
          </a>

        <div className="scrolled-nav-actions" aria-label="Social links" inert={navbarState !== 'visible'}>
          {socialIcons.map(({key, label, icon}) => {
            const href = navbarSocialLinks[key];
            return href ? (
              <a key={key} className="scroll-nav-icon" href={href} aria-label={label} target="_blank" rel="noopener noreferrer">{icon}</a>
            ) : (
              <button key={key} className="scroll-nav-icon" type="button" disabled aria-label={`${label} (link unavailable)`}>{icon}</button>
            );
          })}
        </div>
        </div>

        {/*MOBILE MENU BUTTON */}

        <button
          type="button"
          className="menu-btn"
          onClick={toggleMenu}
          aria-label={
            menuOpen
              ? 'Close navigation'
              : 'Open navigation'
          }
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <X
              size={25}
              strokeWidth={1.5}
            />
          ) : (
            <Menu
              size={25}
              strokeWidth={1.5}
            />
          )}
        </button>

      </div>

      {/* MOBILE NAVIGATION */}

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-nav-wrapper"
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: 'auto',
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
            transition={{
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <nav
              className="mobile-nav"
              aria-label="Mobile navigation"
            >
              {navLinks.map(
                ({ label, path }, index) => (
                  <motion.div
                    key={path}
                    initial={{
                      opacity: 0,
                      y: 12,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: index * 0.04,
                    }}
                  >
                    <NavLink
                      to={path}
                      end={path === '/'}
                      className={({ isActive }) =>
                        `${path === '/contact' ? 'mobile-contact-link' : ''}${isActive ? `${path === '/contact' ? ' ' : ''}active` : ''}` || undefined
                      }
                    >
                      <span className="mobile-link-number">
                        {String(index + 1).padStart(
                          2,
                          '0',
                        )}
                      </span>

                      <span>{label}</span>
                    </NavLink>
                  </motion.div>
                ),
              )}

              <div className="mobile-nav-contact">
                <a href="mailto:info@thilangasumathipala.lk">
                  <Mail
                    size={17}
                    strokeWidth={1.5}
                  />

                  <span>
                    info@thilangasumathipala.lk
                  </span>
                </a>

                <a href="tel:+94112697106">
                  <Phone
                    size={17}
                    strokeWidth={1.5}
                  />

                  <span>
                    (+94) 112 697 106
                  </span>
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

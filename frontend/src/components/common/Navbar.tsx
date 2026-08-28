import {useEffect, useRef, useState} from 'react';
import {Link,NavLink,useLocation} from 'react-router-dom';
import {Mail,Menu,Phone,X} from 'lucide-react';
import {AnimatePresence,motion} from 'framer-motion';
import { imageAssets } from '../../assets/imageAssets';

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
      if (window.scrollY > TOP_THRESHOLD) {
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
      if (menuOpen) {
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

  /*
   * Prevent scrolling behind the mobile menu.
   */
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
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

  return (
    <header className={navbarClassName}>
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
          {navLinks.map(({ label, path }) => (
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
          ))}
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
                        isActive
                          ? 'active'
                          : undefined
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

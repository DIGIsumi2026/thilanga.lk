import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, MessageSquareText, Scale, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  ["Home", "/"],
  ["About", "/about"],
  ["Practice areas", "/practice-areas"],
  ["Attorneys", "/attorneys"],
  ["Journal", "/journal"],
  ["Contact", "/contact"],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [practiceOpen, setPracticeOpen] = useState(false);
  const [attorneyOpen, setAttorneyOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="nav-shell">
        <Link className="brand" to="/">
          <span className="brand-mark">
            <Scale size={18} />
          </span>
          <strong>Lawyer</strong>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map(([label, path]) => {
            const submenu = label === "Practice areas" || label === "Attorneys";
            return (
              <div
                className="nav-item"
                key={path}
                onMouseEnter={() =>
                  submenu &&
                  (label === "Practice areas"
                    ? setPracticeOpen(true)
                    : setAttorneyOpen(true))
                }
                onMouseLeave={() =>
                  submenu &&
                  (label === "Practice areas"
                    ? setPracticeOpen(false)
                    : setAttorneyOpen(false))
                }
              >
                <NavLink to={path}>{label}</NavLink>
                <AnimatePresence>
                  {label === "Practice areas" && practiceOpen && (
                    <PracticeMenu />
                  )}
                  {label === "Attorneys" && attorneyOpen && <AttorneyMenu />}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>
        <Link className="message-link" to="/contact">
          <MessageSquareText size={13} /> Send a message
        </Link>
        <button
          className="menu-btn"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            className="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            {links.map(([label, path]) => (
              <NavLink key={path} to={path} onClick={() => setOpen(false)}>
                {label}
              </NavLink>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

function PracticeMenu() {
  return (
    <motion.div
      className="mega-menu practice-menu"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.22 }}
    >
      {[
        "Human rights law",
        "Criminal law",
        "Employment law",
        "Constitutional law",
        "Securities law",
      ].map((x, i) => (
        <Link key={x} to="/practice-areas">
          <span>0{i + 1}</span>
          {x}
        </Link>
      ))}
    </motion.div>
  );
}
function AttorneyMenu() {
  return (
    <motion.div
      className="mega-menu attorney-menu"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.22 }}
    >
      {["Evan Thomson", "Rosald Smith", "Bryan Johnson", "Jeremy Dupont"].map(
        (x, i) => (
          <Link key={x} to="/attorneys">
            <span className="avatar-dot">{i + 1}</span>
            <div>
              <b>{x}</b>
              <small>Expert in law.</small>
            </div>
          </Link>
        ),
      )}
      <Link className="all-attorneys" to="/attorneys">
        Our attorneys
      </Link>
    </motion.div>
  );
}

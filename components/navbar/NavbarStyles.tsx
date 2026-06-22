export default function NavbarStyles() {
  return (
    <style>{`
      @keyframes ctaSpin {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
      }
      @keyframes navDropIn {
        from { opacity: 0; transform: translateY(-6px) scale(0.98); }
        to   { opacity: 1; transform: translateY(0)    scale(1);    }
      }
      .cta-spin { animation: ctaSpin 5s linear infinite; }
      .nav-drop { animation: navDropIn 0.18s ease forwards; }
    `}</style>
  );
}

export default function Logo({ onClick }) {
  return (
    <button className="nav-logo" onClick={onClick} style={{ background:"none",border:"none" }}>
      <span className="nav-logo-dot" /> DirectP2P
    </button>
  );
}

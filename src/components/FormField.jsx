export default function FormField({ label, id, type="text", ph, err, val, onChange, disabled, extra }) {
  return (
    <div className="form-group">
      <label className="form-label" htmlFor={id}>{label}</label>
      <input id={id} className={`form-input${err?" err":""}`} type={type} placeholder={ph} value={val} onChange={onChange} disabled={disabled} style={{ opacity:disabled?.4:1, ...extra }} />
      {err && <div className="form-err">{err}</div>}
    </div>
  );
}

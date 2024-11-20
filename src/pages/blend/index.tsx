export default function Blend() {
  return (
    <div
      className=""
      style={{
        background:
          "linear-gradient(0deg, rgba(240,240,220,1) 0%, rgba(249,221,213,1) 25%, rgba(236,236,240,1) 75%)",
      }}
    >
      <video autoPlay muted loop className="mix-blend-multiply">
        <source src="/members/alvin.mp4" type="video/mp4" />
      </video>
      <video autoPlay muted loop className="mix-blend-multiply">
        <source src="/members/ben.mp4" type="video/mp4" />
      </video>
      <video autoPlay muted loop className="mix-blend-multiply">
        <source src="/members/ross.mp4" type="video/mp4" />
      </video>
    </div>
  );
}

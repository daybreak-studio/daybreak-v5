export default function Blend() {
  return (
    <div className="">
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

type HeroBannerProps = {
  bannerImage?: string;
};

export default function HeroBanner({ bannerImage = "/banner.png" }: HeroBannerProps) {
  return (
    <section className="w-full bg-black overflow-hidden">
      <a href="#collections" className="block w-full">
        <img
          src={bannerImage}
          alt="Grow More Official Banner"
          className="w-full h-auto max-h-[680px] object-cover block"
        />
      </a>
    </section>
  );
}
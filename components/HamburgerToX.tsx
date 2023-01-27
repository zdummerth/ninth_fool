export default function HamburgerToX({ isOpen }: { isOpen: boolean }) {
  const dur = 'duration-500';
  return (
    <div className={`${isOpen && 'rotate-180'} transition ease-out ${dur}`}>
      <div
        className={`${
          isOpen && 'rotate-45 translate-y-[7px]'
        } w-6 h-[3px] mb-[5px] bg-white transition ease-out ${dur}]`}
      ></div>
      <div
        className={`${
          isOpen && 'opacity-0'
        } w-6 h-[3px] mb-[5px] bg-white transition ease-out ${dur}]`}
      ></div>
      <div
        className={`${
          isOpen && '-rotate-45 translate-y-[-8.5px]'
        } w-6 h-[3px] mb-[5px] bg-white transition ease-out ${dur}]`}
      ></div>
    </div>
  );
}

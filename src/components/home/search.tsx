export default function Search() {
  return (
    <div className="flex items-center justify-center w-full h-1/5 text-dimgray-100 ">
      <div className="flex items-center justify-start px-6 w-[90%] md:w-2/3 h-12 border-1 bg-white-900 border-aqua-blue rounded-3xl gap-5">
        <img className="w-6" src="/tablersearch.svg" alt="" />
        <input
          className="w-full h-full border-none outline-none bg-white-900 overflow-auto pr-2 text-sm "
          type="text"
          placeholder="What course are you looking for?"
        />
      </div>
    </div>
  );
}

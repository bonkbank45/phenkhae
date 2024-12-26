export default function NotFound() {
  return (
    <div className="flex h-screen items-center justify-center p-5 bg-white w-full">
      <div className="text-center">
        <div className="inline-flex rounded-full bg-red-100 p-4">
          <div className="rounded-full stroke-red-600 bg-red-200 p-4">
            <svg
              className="w-16 h-16"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14 5C15.1046 5 16 5.89543 16 7V14C16 15.1046 15.1046 16 14 16C12.8954 16 12 15.1046 12 14V7C12 5.89543 12.8954 5 14 5Z"
                fill="currentColor"
              />
              <path
                d="M14 19C15.1046 19 16 19.8954 16 21C16 22.1046 15.1046 23 14 23C12.8954 23 12 22.1046 12 21C12 19.8954 12.8954 19 14 19Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>
        <h1 className="mt-5 text-[36px] font-bold text-slate-800 lg:text-[50px]">
          404 - Page not found.
        </h1>
        <p className="mt-7 font-notoExtraBold text-slate-600 lg:text-lg">
          หน้าที่คุณต้องการไม่มีอยู่หรือ <br />
          ถูกลบออก
        </p>
      </div>
    </div>
  );
}

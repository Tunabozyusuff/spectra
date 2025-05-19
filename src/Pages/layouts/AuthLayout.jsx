import { Outlet } from "react-router-dom";

export default function AuthLayout() {
    return (
        <div className="min-h-screen bg-[#202227] lg:grid lg:grid-cols-2 p-10">
            {/* --- Sol panel --- */}
            <section className="flex flex-col items-center justify-center">
                {/* Logo */}
                <img src="/assets/logo.svg" alt="spectra" className="w-auto" />

                {/* İçerik (form + başlıklar) */}
                <div className="my-auto w-full max-w-md">
                    <Outlet />
                </div>
            </section>

            <section className="hidden lg:block self-stretch overflow-hidden">
                <img
                    src="/assets/login-bg.jpg"
                    alt="Login background"
                    className="h-full w-full object-cover object-left-top rounded-xl"
                />
            </section>
        </div>
    );
}
